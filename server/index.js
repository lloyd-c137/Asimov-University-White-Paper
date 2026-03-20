const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { initDatabase, prepare } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/users/register', (req, res) => {
  try {
    const { name, region, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Invalid password',
        message: 'Password must be at least 6 characters'
      });
    }
    
    const existingUser = prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'An account with this email already exists'
      });
    }
    
    const id = uuidv4();
    const createdAt = Date.now();
    
    prepare(`
      INSERT INTO users (id, name, region, email, password, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, region || '', email, password, createdAt, 'in_progress');
    
    res.status(201).json({
      success: true,
      user: {
        id,
        name,
        region: region || '',
        email,
        createdAt,
        status: 'in_progress'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }
    
    const user = prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        region: user.region,
        email: user.email,
        createdAt: user.created_at,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login'
    });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const user = prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No user found with this ID'
      });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        region: user.region,
        email: user.email,
        createdAt: user.created_at,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get user'
    });
  }
});

app.put('/api/users/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: 'Status must be pending, approved, or rejected'
      });
    }
    
    const user = prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No user found with this ID'
      });
    }
    
    prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
    
    res.json({
      success: true,
      message: 'User status updated'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update user status'
    });
  }
});

app.post('/api/conversations', (req, res) => {
  try {
    const { userId, messages } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing userId',
        message: 'User ID is required'
      });
    }
    
    const user = prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No user found with this ID'
      });
    }
    
    const id = uuidv4();
    const createdAt = Date.now();
    
    prepare(`
      INSERT INTO conversations (id, user_id, messages, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, JSON.stringify(messages || []), createdAt, createdAt);
    
    res.status(201).json({
      success: true,
      conversation: {
        id,
        userId,
        messages: messages || [],
        createdAt,
        updatedAt: createdAt
      }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create conversation'
    });
  }
});

app.get('/api/conversations/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const conversations = prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
    
    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        userId: conv.user_id,
        messages: JSON.parse(conv.messages),
        createdAt: conv.created_at,
        updatedAt: conv.updated_at
      }))
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get conversations'
    });
  }
});

app.put('/api/conversations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { messages } = req.body;
    
    const conversation = prepare('SELECT id FROM conversations WHERE id = ?').get(id);
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found',
        message: 'No conversation found with this ID'
      });
    }
    
    const updatedAt = Date.now();
    prepare('UPDATE conversations SET messages = ?, updated_at = ? WHERE id = ?').run(
      JSON.stringify(messages),
      updatedAt,
      id
    );
    
    res.json({
      success: true,
      message: 'Conversation updated'
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update conversation'
    });
  }
});

app.get('/api/admin/users', (req, res) => {
  try {
    const users = prepare('SELECT id, name, region, email, created_at, status FROM users ORDER BY created_at DESC').all();
    
    const usersWithApplication = users.map(user => {
      const application = prepare('SELECT id FROM applications WHERE user_id = ? OR email = ?').get(user.id, user.email);
      return {
        ...user,
        hasApplication: !!application
      };
    });
    
    res.json({ users: usersWithApplication });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get users'
    });
  }
});

app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const user = prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No user found with this ID'
      });
    }
    
    prepare('DELETE FROM conversations WHERE user_id = ?').run(id);
    prepare('DELETE FROM users WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete user'
    });
  }
});

app.post('/api/applications/submit', (req, res) => {
  try {
    console.log('Received application submission request');
    const { userId, name, region, email, language, messages, displayMessages, finalResponse, lyraEvaluationReport, submittedAt } = req.body;
    
    console.log('Request data:', { userId, name, region, email, language, messagesCount: messages?.length });
    
    if (!name || !email) {
      console.log('Validation failed: missing name or email');
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name and email are required'
      });
    }
    
    const id = uuidv4();
    console.log('Generated ID:', id);
    
    const messagesStr = JSON.stringify(messages || []);
    const displayMessagesStr = JSON.stringify(displayMessages || []);
    
    console.log('Messages string length:', messagesStr.length);
    console.log('Report length:', lyraEvaluationReport?.length || 0);
    
    prepare(`
      INSERT INTO applications (id, user_id, name, region, email, language, messages, display_messages, final_response, lyra_evaluation_report, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId || null, name, region || '', email, language || 'en', 
           messagesStr, displayMessagesStr, 
           finalResponse || '', lyraEvaluationReport || '', 'pending', submittedAt || Date.now());
    
    console.log('Application saved successfully:', id);
    
    if (userId) {
      prepare('UPDATE users SET status = ? WHERE id = ?').run('pending', userId);
      console.log('User status updated to pending:', userId);
    }
    
    res.status(201).json({
      success: true,
      application: {
        id,
        userId,
        name,
        region,
        email,
        language,
        status: 'pending',
        submittedAt: submittedAt || Date.now()
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to submit application',
      details: error.message
    });
  }
});

app.get('/api/admin/applications', (req, res) => {
  try {
    console.log('Fetching all applications...');
    const applications = prepare('SELECT * FROM applications ORDER BY submitted_at DESC').all();
    console.log('Found applications:', applications.length);
    console.log('Applications data:', applications.map(a => ({ id: a.id, name: a.name, email: a.email, status: a.status })));
    res.json({ 
      applications: applications.map(app => ({
        id: app.id,
        userId: app.user_id,
        name: app.name,
        region: app.region,
        email: app.email,
        language: app.language,
        messages: JSON.parse(app.messages || '[]'),
        displayMessages: JSON.parse(app.display_messages || '[]'),
        finalResponse: app.final_response,
        status: app.status,
        submittedAt: app.submitted_at,
        reviewedAt: app.reviewed_at,
        reviewerNotes: app.reviewer_notes
      }))
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get applications'
    });
  }
});

app.get('/api/admin/applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const application = prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found',
        message: 'No application found with this ID'
      });
    }
    
    res.json({
      application: {
        id: application.id,
        userId: application.user_id,
        name: application.name,
        region: application.region,
        email: application.email,
        language: application.language,
        messages: JSON.parse(application.messages || '[]'),
        displayMessages: JSON.parse(application.display_messages || '[]'),
        finalResponse: application.final_response,
        status: application.status,
        submittedAt: application.submitted_at,
        reviewedAt: application.reviewed_at,
        reviewerNotes: application.reviewer_notes
      }
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get application'
    });
  }
});

app.put('/api/admin/applications/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerNotes } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'conditional'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: 'Status must be pending, approved, rejected, or conditional'
      });
    }
    
    const application = prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found',
        message: 'No application found with this ID'
      });
    }
    
    const reviewedAt = Date.now();
    prepare('UPDATE applications SET status = ?, reviewer_notes = ?, reviewed_at = ? WHERE id = ?')
      .run(status, reviewerNotes || null, reviewedAt, id);
    
    if (application.user_id) {
      prepare('UPDATE users SET status = ? WHERE id = ?').run(status, application.user_id);
    }
    
    res.json({
      success: true,
      message: 'Application status updated'
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update application status'
    });
  }
});

app.delete('/api/admin/applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const application = prepare('SELECT id FROM applications WHERE id = ?').get(id);
    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found',
        message: 'No application found with this ID'
      });
    }
    
    prepare('DELETE FROM applications WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete application'
    });
  }
});

app.post('/api/emails/send', (req, res) => {
  try {
    const { toEmail, toName, fromEmail, fromName, subject, body } = req.body;
    
    if (!toEmail || !subject || !body) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'toEmail, subject, and body are required'
      });
    }
    
    const id = uuidv4();
    const createdAt = Date.now();
    
    prepare(`
      INSERT INTO emails (id, to_email, to_name, from_email, from_name, subject, body, is_read, created_at, folder)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'inbox')
    `).run(id, toEmail, toName || '', fromEmail || 'admissions@asimov.edu', fromName || 'Asimov University', subject, body, createdAt);
    
    res.status(201).json({
      success: true,
      email: {
        id,
        toEmail,
        toName,
        fromEmail: fromEmail || 'admissions@asimov.edu',
        fromName: fromName || 'Asimov University',
        subject,
        body,
        isRead: false,
        createdAt,
        folder: 'inbox'
      }
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to send email'
    });
  }
});

app.get('/api/emails/inbox/:email', (req, res) => {
  try {
    const { email } = req.params;
    
    const emails = prepare('SELECT * FROM emails WHERE to_email = ? AND folder = ? ORDER BY created_at DESC')
      .all(email, 'inbox');
    
    res.json({
      emails: emails.map(e => ({
        id: e.id,
        toEmail: e.to_email,
        toName: e.to_name,
        fromEmail: e.from_email,
        fromName: e.from_name,
        subject: e.subject,
        body: e.body,
        isRead: e.is_read === 1,
        createdAt: e.created_at,
        folder: e.folder
      }))
    });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get emails'
    });
  }
});

app.put('/api/emails/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    prepare('UPDATE emails SET is_read = ? WHERE id = ?').run(isRead ? 1 : 0, id);
    
    res.json({
      success: true,
      message: 'Email read status updated'
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update email'
    });
  }
});

app.delete('/api/emails/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const email = prepare('SELECT id FROM emails WHERE id = ?').get(id);
    if (!email) {
      return res.status(404).json({ 
        error: 'Email not found',
        message: 'No email found with this ID'
      });
    }
    
    prepare('DELETE FROM emails WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete email'
    });
  }
});

app.get('/api/users/status/:email', (req, res) => {
  try {
    const { email } = req.params;
    
    const user = prepare('SELECT id, name, email, status FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.json({ 
        exists: false,
        hasApplied: false,
        status: null
      });
    }
    
    const application = prepare('SELECT id, status FROM applications WHERE email = ?').get(email);
    
    res.json({
      exists: true,
      hasApplied: !!application,
      status: application ? application.status : user.status,
      userId: user.id,
      name: user.name
    });
  } catch (error) {
    console.error('Get user status error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get user status'
    });
  }
});

// Logging API endpoints
 app.post('/api/logs', (req, res) => {
   try {
     const { level, message, source, metadata } = req.body;
     
     if (!level || !message) {
       return res.status(400).json({ 
         error: 'Missing required fields',
         message: 'Level and message are required'
       });
     }
     
     const id = uuidv4();
     const timestamp = Date.now();
     
     prepare(`
       INSERT INTO logs (id, level, message, source, metadata, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)
     `).run(id, level, message, source || 'server', JSON.stringify(metadata || {}), timestamp);
     
     res.status(201).json({
       success: true,
       log: {
         id,
         level,
         message,
         source,
         metadata,
         timestamp
       }
     });
   } catch (error) {
     console.error('Create log error:', error);
     res.status(500).json({ 
       error: 'Internal server error',
       message: 'Failed to create log'
     });
   }
 });
 
 app.get('/api/logs', (req, res) => {
   try {
     const { level, source, limit = 100, offset = 0 } = req.query;
     
     let query = 'SELECT * FROM logs';
     const params = [];
     const conditions = [];
     
     if (level) {
       conditions.push('level = ?');
       params.push(level);
     }
     
     if (source) {
       conditions.push('source = ?');
       params.push(source);
     }
     
     if (conditions.length > 0) {
       query += ' WHERE ' + conditions.join(' AND ');
     }
     
     query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
     params.push(parseInt(limit), parseInt(offset));
     
     const logs = prepare(query).all(...params);
     
     res.json({
       logs: logs.map(log => ({
         id: log.id,
         level: log.level,
         message: log.message,
         source: log.source,
         metadata: JSON.parse(log.metadata || '{}'),
         timestamp: log.timestamp
       }))
     });
   } catch (error) {
     console.error('Get logs error:', error);
     res.status(500).json({ 
       error: 'Internal server error',
       message: 'Failed to get logs'
     });
   }
 });
 
 // Admin logs API endpoints
 app.post('/api/admin/logs', (req, res) => {
   try {
     const { action, details, userEmail, targetId, targetType } = req.body;
     
     if (!action) {
       return res.status(400).json({ 
         error: 'Missing required fields',
         message: 'Action is required'
       });
     }
     
     const id = uuidv4();
     const createdAt = Date.now();
     
     prepare(`
       INSERT INTO admin_logs (id, action, details, user_email, target_id, target_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
     `).run(id, action, details || null, userEmail || null, targetId || null, targetType || null, createdAt);
     
     res.status(201).json({
       success: true,
       log: {
         id,
         action,
         details,
         userEmail,
         targetId,
         targetType,
         createdAt
       }
     });
   } catch (error) {
     console.error('Create admin log error:', error);
     res.status(500).json({ 
       error: 'Internal server error',
       message: 'Failed to create admin log'
     });
   }
 });
 
 app.get('/api/admin/logs', (req, res) => {
   try {
     const { action, targetType, limit = 100, offset = 0 } = req.query;
     
     let query = 'SELECT * FROM admin_logs';
     const params = [];
     const conditions = [];
     
     if (action) {
       conditions.push('action = ?');
       params.push(action);
     }
     
     if (targetType) {
       conditions.push('target_type = ?');
       params.push(targetType);
     }
     
     if (conditions.length > 0) {
       query += ' WHERE ' + conditions.join(' AND ');
     }
     
     query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
     params.push(parseInt(limit), parseInt(offset));
     
     const logs = prepare(query).all(...params);
     
     res.json({
       logs: logs.map(log => ({
         id: log.id,
         action: log.action,
         details: log.details,
         userEmail: log.user_email,
         targetId: log.target_id,
         targetType: log.target_type,
         createdAt: log.created_at
       }))
     });
   } catch (error) {
     console.error('Get admin logs error:', error);
     res.status(500).json({ 
       error: 'Internal server error',
       message: 'Failed to get admin logs'
     });
   }
 });

// Email Templates API endpoints
app.get('/api/email-templates', (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM email_templates';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const templates = prepare(query).all(...params);
    
    res.json({
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        subject: template.subject,
        body: template.body,
        variables: JSON.parse(template.variables || '[]'),
        isActive: template.is_active === 1,
        createdAt: template.created_at,
        updatedAt: template.updated_at
      }))
    });
  } catch (error) {
    console.error('Get email templates error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get email templates'
    });
  }
});

app.get('/api/email-templates/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const template = prepare('SELECT * FROM email_templates WHERE id = ?').get(id);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: 'No email template found with this ID'
      });
    }
    
    res.json({
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        subject: template.subject,
        body: template.body,
        variables: JSON.parse(template.variables || '[]'),
        isActive: template.is_active === 1,
        createdAt: template.created_at,
        updatedAt: template.updated_at
      }
    });
  } catch (error) {
    console.error('Get email template error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get email template'
    });
  }
});

app.post('/api/email-templates', (req, res) => {
  try {
    const { name, category, subject, body, variables, isActive } = req.body;
    
    if (!name || !category || !subject || !body) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, category, subject, and body are required'
      });
    }
    
    const id = uuidv4();
    const createdAt = Date.now();
    
    prepare(`
      INSERT INTO email_templates (id, name, category, subject, body, variables, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, category, subject, body, JSON.stringify(variables || []), isActive !== false ? 1 : 0, createdAt, createdAt);
    
    res.status(201).json({
      success: true,
      template: {
        id,
        name,
        category,
        subject,
        body,
        variables: variables || [],
        isActive: isActive !== false,
        createdAt,
        updatedAt: createdAt
      }
    });
  } catch (error) {
    console.error('Create email template error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create email template'
    });
  }
});

app.put('/api/email-templates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, subject, body, variables, isActive } = req.body;
    
    const template = prepare('SELECT id FROM email_templates WHERE id = ?').get(id);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: 'No email template found with this ID'
      });
    }
    
    const updatedAt = Date.now();
    
    prepare(`
      UPDATE email_templates 
      SET name = ?, category = ?, subject = ?, body = ?, variables = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `).run(
      name,
      category,
      subject,
      body,
      JSON.stringify(variables || []),
      isActive !== false ? 1 : 0,
      updatedAt,
      id
    );
    
    res.json({
      success: true,
      message: 'Email template updated'
    });
  } catch (error) {
    console.error('Update email template error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update email template'
    });
  }
});

app.delete('/api/email-templates/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const template = prepare('SELECT id FROM email_templates WHERE id = ?').get(id);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: 'No email template found with this ID'
      });
    }
    
    prepare('DELETE FROM email_templates WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'Email template deleted successfully'
    });
  } catch (error) {
    console.error('Delete email template error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete email template'
    });
  }
});

async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Asimov University API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
