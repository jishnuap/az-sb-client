// Swagger set up
const options = {
    swaggerDefinition: {
        info: {
            title: "Azure Service Bus Client",
            version: "1.0.0",
            description: "Sample project to connect to azure service bus using nodejs",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/",
            },
            contact: {
                name: "Jishnu",
                url: "https://github.com/jishnuap/az-sb-client",
            },
        },
        servers: [
            {
                url: "http://localhost:4000/",
            },
        ],
    },
    // list of files to be processes. You can also set globs './routes/*.js'
    apis: ["./src/controllers/**/*.ts"],
};

export { options as swaggerOptions };
