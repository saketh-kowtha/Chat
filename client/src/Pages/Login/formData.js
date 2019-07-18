export const formData = {
      "Sign Up": [
            {
                  label : 'Full Name',
                  name: 'username',
                  type: 'text',
                  icon: 'user',
                  isRequired: true,
                  validation : (value) => value && (/[a-z]/).test(value) ? true : "Incorrect Name"
            },
            {
                  label : 'Password',
                  name: 'password',
                  type: 'password',
                  icon: 'lock',
                  isRequired: true,
                  validation : (value) => value && value.length > 8  ? true : "Incorrrect Password"
            },
            {
                  label : 'Email',
                  name: 'email',
                  type: 'email',
                  icon: 'mail',
                  isRequired: true,
                  validation : (value) => value &&  (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(value) ? true : "Incorrect Email"
            },
            {
                  label : 'Mobile',
                  name: 'phoneNumber',
                  type: 'number',
                  icon: 'mobile',
                  isRequired: true,
                  validation : (value) => value && value.length === 10  ? true : "Incorrect Mobile Number"
            }
      ],
      "Login" :[
            {
                  label : 'User Name',
                  type: 'text',
                  name: 'username',
                  icon: 'user',
                  isRequired: true,
                  validation : (value) => value && (/[a-z]/).test(value) ? true : "Incorrect Name"
            },
            {
                  label : 'Password',
                  type: 'password',
                  name: 'password',                  
                  icon: 'lock',
                  isRequired: true,
                  validation : (value) => value && value.length > 8  ? true : "Incorrrect Password"
            }
      ]
}

