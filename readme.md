# ![LOGO](logo.png) SMS-Gateway **flow**ground Connector
SMS-Gateway Connector for sending SMS per Telekom (OTC) SMS-Service.

## Configuration
To successful configure this connector you will need 5 parameters:

### Environment variables:
1. `SMSUri`:  the Telekom SMS-Service (SOAP) Uri
2. `AppSec`:  a security token
3. `AppId`:   a token to identify the requested service

### Credentials:
4. `GUID`:    a customer specific token
5. `PMI KEY`:  a billing related token

**For security concerns all the tokens will be provided in a secure location.**

*Please note upper/lower case carefully. It's essential!*

## License

**flow**ground :- Telekom iPaaS / sms-gateway-connector<br/>
Copyright © 2020, [Deutsche Telekom AG](https://www.telekom.de)<br/>
contact: https://flowground.net/en/support-and-contact

All files of this connector are licensed under the Apache 2.0 License. For details
see the file LICENSE on the top-level directory.