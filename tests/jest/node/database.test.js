/* eslint-disable no-undef */
//database.test.js
const {pool, insertUser, getUserByUsername, updateUserPassword, deleteUserByUsername, deleteUserById } = require('../../../database'); // Import database functions and pool

describe('Database Functions', () => {
  let userByUsername; // Store user created for getUserByUsername test
  let userById; // Store user created for deleteUserById test

  // Test case for insertUser function
  describe('insertUser', () => {
    it('should insert a user into the database', async () => {
      // Mock data
      const username = 'testuser';
      const hashedPassword = 'hashedpassword';
      const role = 'user';
  
      // Call the function
      const result = await insertUser(username, hashedPassword, role);
  
      // Store the inserted user for cleanup
      userByUsername = result;
  
      // Assertions
      expect(result).toBeDefined();
      expect(result.username).toEqual(username);
      expect(result.password_hash).toEqual(hashedPassword);
      expect(result.role).toEqual(role);
    });

    it('should handle errors during user insertion', async () => {
    // Mock data
    const username = 'testuser2';
    const hashedPassword = 'hashedpassword';
    const role = 'user';

    // Mock the behavior of pool.connect() to throw an error
    jest.spyOn(pool, 'connect').mockImplementationOnce(() => {
        throw new Error('Mocked database error');
    });
    
        try {
            // Call the function
            await insertUser(username, hashedPassword, role);
        } catch (error) {
            // Assertions
            jest.spyOn(console, 'error').mockImplementation(() => { expect(error.message).toEqual('Mocked database error');});
           
        }
    
    
        // Restore the original implementation
        jest.restoreAllMocks();
    });
    
    it('should release the client back to the pool on error', async () => {
        // Mock data
        const username = 'testuser2';
        const hashedPassword = 'hashedpassword';
        const role = 'user';
    
        // Mock the behavior of pool.connect() to throw an error
        const mockQuery = jest.fn(); // Mock the query method
        const mockClient = {
            query: mockQuery,
            release: jest.fn() // Mock the release method
        };
        jest.spyOn(pool, 'connect').mockResolvedValueOnce(mockClient);
    
        // Mock the console.error method to prevent logging during the test
        jest.spyOn(console, 'error').mockImplementation(() => {});
    
        // Expect the query method to throw an error
        mockQuery.mockRejectedValueOnce(new Error('Mocked database error'));
    
        try {
            // Call the function
            await insertUser(username, hashedPassword, role);
        } catch (error) {
            // Ensure that the error is properly thrown
            jest.spyOn(console, 'error').mockImplementation(() => { expect(error.message).toEqual('Mocked database error');});
           
        }
        jest.spyOn(console, 'error').mockImplementation(() => {});
        // Verify that pool.connect() was called exactly once
        expect(pool.connect).toHaveBeenCalledTimes(1);
    
        // Verify that the client.release() method was called
        expect(mockClient.release).toHaveBeenCalledTimes(1);
    
        // Restore the original implementations
        jest.restoreAllMocks();
    });

    
    afterAll(async () => {
      // Clean up inserted user after tests
      await deleteUserByUsername('testuser');
      await deleteUserByUsername('testuser2');
    });
  });

  // Test case for getUserByUsername function
  describe('getUserByUsername', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    beforeAll(async () => {
      // Insert a user for testing getUserByUsername
      userByUsername = await insertUser('userByUsername', 'password', 'role');
    });

    afterAll(async () => {
      // Clean up inserted user after tests
      await deleteUserByUsername('userByUsername');
    });

    it('should retrieve a user from the database by username', async () => {
      // Call the function
      const result = await getUserByUsername(userByUsername.username);

      // Assertions
      expect(result).toEqual(userByUsername);
    });

    it('should return null if user is not found', async () => {
      // Call the function with a non-existent username
      const result = await getUserByUsername('nonexistentuser');

      // Assertions
      expect(result).toBeNull();
    });

    it('should handle errors during user retrieval', async () => {
        // Mock the behavior of pool.query() to throw an error
        jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Mocked database error'));

        try {
            // Call the function
            await getUserByUsername('userByUsername');
        } catch (error) {
            // Ensure that the error is properly thrown
            jest.spyOn(console, 'error').mockImplementation(() => {expect(error.message).toEqual('Mocked database error');});
            
        }
  });
});

  // Test case for updateUserPassword function
  describe('updateUserPassword', () => {
    beforeAll(async () => {
      // Insert a user for testing updateUserPassword
      userByUsername = await insertUser('userToUpdatePassword', 'password', 'role');
    });

    afterAll(async () => {
      // Clean up inserted user after tests
      await deleteUserByUsername('userToUpdatePassword');
    });

    it('should update user password in the database', async () => {
      // Mock data
      const newPassword = 'newhashedpassword';

      // Call the function
      await updateUserPassword(userByUsername.username, newPassword);

      // Retrieve the updated user
      const updatedUser = await getUserByUsername(userByUsername.username);

      // Assertions
      expect(updatedUser).toBeDefined();
      expect(updatedUser.username).toEqual(userByUsername.username);
      expect(updatedUser.password_hash).toEqual(newPassword);
    });

    it('should handle errors during user password update', async () => {
        // Mock the behavior of pool.query() to throw an error
        jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Mocked database error'));

        // Mock data
        const newPassword = 'newhashedpassword';

        try {
            // Call the function
            await updateUserPassword(userByUsername.username, newPassword);
        } catch (error) {
            // Ensure that the error is properly thrown
            jest.spyOn(console, 'error').mockImplementation(() => {expect(error.message).toEqual('Mocked database error');});
            
        }

        // Restore the original implementation
        jest.restoreAllMocks();
    });
  });

  // Test case for deleteUserByUsername function
  describe('deleteUserByUsername', () => {
    // Insert a user for testing deleteUserByUsername
    beforeAll(async () => {
      await insertUser('userForDeleteByUsername', 'password', 'role');
    });
  
    // Clean up inserted user after tests
    afterAll(async () => {
      await deleteUserByUsername('userForDeleteByUsername');
    });
  
    it('should delete a user from the database by username', async () => {
      const result = await deleteUserByUsername('userForDeleteByUsername');
  
      // Assertions
      expect(result).toBeDefined();
      expect(result.username).toEqual('userForDeleteByUsername');
    });
  
    it('should return null if user is not found', async () => {
      // Attempt to delete a non-existent user
      const nonExistentResult = await deleteUserByUsername('nonExistentUser');
  
      // Assertions
      expect(nonExistentResult).toBeNull();
    });

    it('should handle errors during user deletion by username', async () => {
        // Mock the behavior of pool.query() to throw an error
        jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Mocked database error'));

        try {
            // Call the function
            await deleteUserByUsername('userForDeleteByUsername');
        } catch (error) {
            // Ensure that the error is properly thrown
            jest.spyOn(console, 'error').mockImplementation(() => {
                expect(error.message).toEqual('Mocked database error');
            });
            
        }
    });
});

  // Test case for deleteUserById function
  describe('deleteUserById', () => {
  
    // Insert a user for testing deleteUserById
    beforeAll(async () => {
      userById = await insertUser('userForDeleteById', 'password', 'role');
    });
  
    // Clean up inserted user after tests
    afterAll(async () => {
      await deleteUserById(userById.id);
    });
  
    it('should delete a user from the database by user ID', async () => {
      // Call the function
      const result = await deleteUserById(userById.id);
  
      // Assertions
      expect(result).toBeDefined();
      expect(result.id).toEqual(userById.id);
    });
  
    it('should return null if user ID does not exist', async () => {
      // Attempt to delete a non-existent user
      const nonExistentResult = await deleteUserById(-1); // Provide a non-existent user ID
  
      // Assertions
      expect(nonExistentResult).toBeNull();
    });

    it('should handle errors during user deletion by ID', async () => {
        // Mock the behavior of pool.query() to throw an error
        jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Mocked database error'));

        try {
            // Call the function
            await deleteUserById(userById.id);
        } catch (error) {
            // Ensure that the error is properly thrown
            jest.spyOn(console, 'error').mockImplementation(() => {expect(error.message).toEqual('Mocked database error');});
            
        }
    });
  });
});
