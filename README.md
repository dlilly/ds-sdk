# ds-sdk

`ds-sdk` is an implementation of:

- a TypeScript SDK and data model for integration with Delivery Solutions
- a command-line interface (`ds`) to Delivery Solutions

It loosely follows the MVC pattern:

- `src/model` provides the DS TypeScript models (model)
- `src/ui` provides facilities to interact with the cli user (view)
- `src/commands` provides the cli interface (controller)

Additionally, a Delivery Solutions client interface is provided in `src/ds` which wraps the Delivery Solutions microservices. Documentation is located here: https://docs.deliverysolutions.co/reference/introduction