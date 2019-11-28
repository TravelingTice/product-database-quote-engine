const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

const upload2 = require('../../services/file-upload2');

module.exports = (app) => {
  app.post('/api/account/signup', upload2.array('businessCard', 1), (req, res) => {
    const { body } = req;
    const {
      username,
      email,
      password
    } = body;
    
    if (!username) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!email) return res.send({
      success: false,
      message: 'Email cannot be blank'
    });
    if(!password) return res.send({
      success: false,
      message: 'Password cannot be blank'
    });

    // check if user already exists
    User.find({
      username,
      isDeleted: false
    }, (err, users) => {
      if (err) return res.send({
        success: false,
        message: 'There was an error: ' + err
      });
      if (users.length > 0) return res.send({
        success: false,
        message: 'User already exists'
      });

      // save user
      const newUser = new User({
        ...body
      });

      newUser.email = email.toLowerCase();
      const password = newUser.password;
      newUser.password = newUser.generateHash(password);
      // bug: it's .Location, not .location
      newUser.businessCard = req.files.length >= 1 ? req.files[0].Location : 'https://pdqe.s3-ap-southeast-1.amazonaws.com/default.jpg';

      newUser.save((err, user) => {
        if (err) return res.send({
          success: false,
          message: 'Error: ' + err
        });
        if (user) return res.send({
          success: true,
          message: newUser.username + ' is signed up',
          user: newUser,
          // send unencrypted password back for email to new user
          password
        });
      });
    });
  });

  app.post('/api/account/signin', (req, res) => {
    const { body } = req;
    const { username, password } = body;
    // find user
    User.find({
      username,
      isDeleted: false
    }, (err, users) => {
      if (err) return res.send({
        success: false,
        message: 'Server error: ' + err
      });
      if (users.length != 1) return res.send({
        success: false,
        message: 'No user found'
      });

      // check password
      const user = users[0];
      if (!user.validPassword(password)) return res.send({
        success: false,
        message: 'Invalid password'
      });
      // create UserSession
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.username = user.username
      userSession.role = user.role;
      // save session
      userSession.save((err, session) => {
        if (err) return res.send({
          success: false,
          message: 'Server error: ' + err
        });
        return res.send({
          success: true,
          message: 'User is signed in',
          token: session._id,
          role: user.role,
          username: user.username
        });
      });
    });
  });

  app.get('/api/account/verify', (req, res) => {
    const { query } = req;
    const { token } = query;

    // Verify token is one of a kind and not deleted

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) return res.send({
        success: false,
        message: 'Server error: ' + err
      });
      if (sessions.length != 1) return res.send({
        success: false,
        message: 'Invalid'
      });
      return res.send({
        success: true,
        message: 'Verified',
        sessions
      });
    });
  });

  app.get('/api/account/signout', (req, res) => {
    const { query } = req;
    const { token } = query;

    UserSession.updateOne({
      _id: token,
      isDeleted: false
    }, {
      $set: { isDeleted: true }
    }, { new: true }, (err, sessions) => {
      if (err) return res.send({
        success: false,
        message: 'Something went wrong: ' + err
      });
      return res.send({
        success: true,
        message: 'Logged out'
      });
    });
  });

  app.get('/api/account/getUsers', (req, res) => {
    User.find({ isDeleted: false }, (err, users) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Users fetched',
        users
      })
    })
  })

  app.get('/api/account/getUser', (req, res) => {
    const { username } = req.query;
    User.find({
      username,
      isDeleted: false
    }, (err, users) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      if (users.length !== 1) return res.send({
        success: false,
        message: 'No user found'
      });
      return res.send({
        success: true,
        message: 'User found',
        user: users[0]
      });
    });
  });

  app.get('/api/account/getUserByID', (req, res) => {
    const { id } = req.query;
    User.find({
      _id: id,
      isDeleted: false
    }, (err, users) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      if (users.length !== 1) return res.send({
        success: false,
        message: 'No user found'
      });
      return res.send({
        success: true,
        message: 'User found',
        user: users[0]
      });
    });
  });

  app.put('/api/account/updateUser', upload2.array('businessCard', 1), (req, res) => {
    const { body } = req;

    const updatedUser = body;
    // check if a businesscard has been passed thru and uploaded. If so, update the url of the updated user
    if (req.files.length >= 1) {
      updatedUser.businessCard = req.files[0].Location;
    }

    User.updateOne({
      _id: updatedUser._id,
      isDeleted: false
    }, {
       $set: { ...updatedUser }
    }, { new: true }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'User updated',
        user: updatedUser,
        docs
      });
    });
  });

  app.post('/api/account/removeUser', (req, res) => {
    const { body } = req;
    const { username, email} = body;

    User.updateOne({
      username,
      email,
      isDeleted: false
    }, {
      $set: { isDeleted: true }
    }, { new: true }, (err, data) => {
        if (err) return res.send({
          success: false,
          message: 'Server error: ' + err
        });
        return res.send({
          success: true,
          message: 'Person is deleted'
        });
    });
  });

  app.get('/api/account/getCurrentUser', (req, res) => {
    UserSession.find({ isDeleted: false }, (err, sessions) => {
      if (err) return res.send({
        success: false,
        message: 'Server error: ' + err
      });
      const currentSession = sessions[sessions.length -1];
      const currentUser = currentSession.username;
      return res.send({
        success: true,
        message: 'Current user fetched',
        user: currentUser
      });
    });
  });

};
