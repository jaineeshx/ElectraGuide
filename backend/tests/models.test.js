const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model', () => {
  it('should create a user with default values', () => {
    const user = new User({
      firebaseId: 'user123',
      email: 'test@example.com'
    });
    
    expect(user.profile.language).toBe('en');
    expect(user.profile.isFirstTimeVoter).toBe(false);
    expect(user.journeyProgress).toHaveLength(0);
  });

  it('should require firebaseId and email', () => {
    const user = new User({});
    const err = user.validateSync();
    expect(err.errors.firebaseId).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should accept profile details', () => {
    const user = new User({
      firebaseId: 'user123',
      email: 'test@example.com',
      profile: {
        age: 25,
        location: { state: 'Delhi', district: 'New Delhi' }
      }
    });
    expect(user.profile.age).toBe(25);
    expect(user.profile.location.state).toBe('Delhi');
  });
});
