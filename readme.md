# SMS-Gateway Connector - eio.smsgateway
SMS-Gateway Connector for sending SMS per Telekom (OTC) SMS-Service.

## Configuration
To successful configure this connector you will need 5 parameters:

### Environment variables:
1. `SMSUri`:  the Telekom SMS-Service (SOAP) Uri
2. `AppSec`:  a security token
3. `AppId`:   a token to identify the requested service

### Credentials:
4. `guid`:    a customer specific token
5. `pmiKey`:  a billing related token

**For security concerns all the tokens will be provided in a secure location.**

*Please note upper/lower case carefully. It's essential!*