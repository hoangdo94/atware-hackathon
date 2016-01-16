let signup = (options) => {
  _validate(options.form, options.template);
};

let _validate = (form, template) => {
  $(form).validate(validation(template));
};

let validation = (template) => {
  return {
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      nickname: {
        required: true,
        maxlength: 20
      },
      password: {
        required: true,
        minlength: 6
      },
      'password-repeat': {
        required: true,
        equalTo: '#password'
      }
    },
    messages: {
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?'
      },
      nickname: {
        required: 'Please choose your nickname.',
        maxlength: 'Use at most twenty characters, please.'
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.'
      },
      'password-repeat': {
        required: 'Need a password here.',
        equalTo: 'Passwords do not match.'
      }
    },
    submitHandler() {
      _handleSignup(template);
    }
  };
};

let _handleSignup = (template) => {
  let user = {
    email: template.find('[name="emailAddress"]').value,
    password: template.find('[name="password"]').value,
    profile: {
      nickname: template.find('[name="nickname"]').value
    }
  };

  Accounts.createUser(user, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger', 'growl-top-right');
    } else {
      Bert.alert('Welcome!', 'success', 'growl-top-right');
    }
  });
};

Modules.client.signup = signup;
