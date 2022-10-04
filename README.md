# TheBloggr-Frontend

If you see "Not Found" error while directly browsing to a specific path, For eg: https://yourdomain.com/something , this might be helpfull (ReactJS):

In your public folder (folder which contains index.html) create a file called _redirects with no extension. Then, type the following inside it:

/*    /index.html    200

Now save, commit, push and publish. :)

Reason for "Not Found" is because, when using router eg: React Router it handles all the routes but when you directly goto an endpoint, netlify must know where to redirect you. That is what we are specifying in the _redirects file.