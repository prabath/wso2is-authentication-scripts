// system should have two roles pickup-admin and pickup-user
// four steps engaged with the corresponding service provider: username/password (step-1), OTP over SMS (step-2), FIDO U2F (step-3), Is9445 as an IdP (step-4)

var allowedRoles = ['pickup-admin', 'pickup-user'];
var rolesForFido = ['pickup-admin'];

function onLoginRequest(context) {
	var email = context.request.headers['email'];
	var i = email.indexOf('@')
        var domain = email.substring(i + 1, email.length);
	if (domain.toLowerCase() == 'wso2.com' ) {
		executeStep(4);
	} else {
		executeStep(1, {
			onSuccess: function (context) {
				var idp = context.steps[1].idp;
				var user = context.steps[1].subject;
				if (idp == 'LOCAL') {
					var inAllowedRoles = hasAnyOfTheRoles(user, allowedRoles);
					if (!inAllowedRoles) {
						sendError('http://carpooling.com:8080/oidc-web-app-pickup/', {});
					}
					var useFido = hasAnyOfTheRoles(user, rolesForFido);

					if (useFido) {
						executeStep(3);
					} else {
						executeStep(2);
					}
				} else {
					var firstName = user.remoteClaims.first_name;
					var lastName = user.remoteClaims.last_name;
					user.remoteClaims.full_name = firstName + ' ' + lastName;
				}
			}
		});
	}
}
