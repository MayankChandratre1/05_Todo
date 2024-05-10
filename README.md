## Tech Stack
<ul>
  <li>ExpressJS</li>
  <li>EJS</li>
  <li>NodeJS</li>
  <li>MongoDB</li>
</ul>

## Functionality 
1. Home page has a heading and a signup form. You can create accounts here.
2. There is no input validation but you can create only one account out of one email.
3. You can navigate to Login page and login using email & password.
4. Password is stored as a hash using bcrypt library. So no one knows your password.
5. Logging in stores a jwt token in your cookies.
6. For every protected route a middleware checks this token.
7. You can sign in in different account store todos mark them as done or delete them.
8. You can only edit todos that the account has created and cannot access todos of other accounts.
