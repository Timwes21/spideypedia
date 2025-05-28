import { createUser, authorizeUsername, authorizeUser, getUsername, forgetUserToken } from "../db/auth.js";
import { testCollection } from "../db/db.js";
import { getToken } from "../utils/encryption.js";


test('creates a user', async()=>{
    const newUser = {username: "johnnn", password: "johnnn", email: "11", phone: "77"};
    const expectedLength = getToken().length;
    const newToken = await createUser(newUser, testCollection);
    console.log(newToken);
    
    expect(newToken.length).toBe(expectedLength);
})

test('authroizes user', async()=>{
    const expectedBoolean = await authorizeUsername("timmy", testCollection);
    expect(typeof expectedBoolean).toBe('boolean');
})

test('authorizes user', async()=>{
    const result = await authorizeUser("johnnn", "johnnn", testCollection);
    expect(typeof result).toBe('string');
})

test('gets the username', async()=>{
    expect(await getUsername("token", testCollection)).toBe("timwes21");
})

test('forget user token', async()=>{
    const testToken = 'testToken';
    await testCollection.updateOne({"userInfo.username": "timwes21"},{$push: {tokens: testToken}});
    const result = await forgetUserToken({token: testToken}, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
    
})