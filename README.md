# 📦 neat-logger

A structured, pluggable, and environment-friendly logging utility built with [Winston](https://github.com/winstonjs/winston) — optimized for modern Node.js apps and microservices.

> Designed to be reused across projects and services — with built-in metadata support, file logging, and support for trace IDs.

---

## ✨ Features

- ✅ JSON-structured logging
- ✅ Log level support (`info`, `warn`, `error`, `debug`)
- ✅ Automatic file/function tracing
- ✅ File-based logs (error, combined, query)
- ✅ Production-ready Winston setup
- ✅ Easy `traceId` injection for request tracing
- ✅ Console + file output

---

## 📦 Installation

```bash
npm install neat-logger
```

Or if using from local development:

```bash
# Inside the neat-logger folder
npm link

# Inside your service/project folder
npm link neat-logger
```

---

## 🧑‍💻 Usage

### 1. Basic Logging

```js
const { logWithMeta } = require('neat-logger');

logWithMeta("User created successfully", {
  func: "createUser",
  extra: { userId: 123 }
});
```

### 2. Traceable Logging (with `traceId`)

```js
logWithMeta("Fetching user details", {
  func: "getUserById",
  extra: {
    id: 42,
    traceId: req.traceId   // Automatically added via middleware
  }
});
```

### 3. Levels

```js
logWithMeta("Something went wrong", { level: "error" });
logWithMeta("Debugging DB issue", { level: "debug" });
logWithMeta("Just an info", { level: "info" });
```

---

## 🗂 Logs Generated

By default, this logger writes logs to a `logs/` directory:

| File           | Purpose                        |
|----------------|--------------------------------|
| `error.log`    | Errors only (`level: error`)   |
| `combined.log` | All logs (`info` and above)    |
| `query.log`    | For debugging/queries (`debug` level) |

Console output is colorized and formatted for readability.

---

## 🧩 Recommended Express Middleware

Use this to inject `traceId` into every request:

```js
// traceMiddleware.js
const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  req.traceId = uuidv4();
  res.setHeader("X-Trace-Id", req.traceId);
  next();
};
```

---

## 💡 Internals

- Uses [Winston](https://github.com/winstonjs/winston) under the hood
- Formats logs with timestamp, level, message, and metadata
- Auto-detects calling file/function via stack trace

---

## 📜 License

MIT © NeatSpend Team

---

## 🤝 Contributing

Pull requests are welcome! Open an issue first to discuss major changes.
