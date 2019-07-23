const _express = require("express");
const _expressWs = require("express-ws");
const _router = _express.Router();

const port = process.env.PORT || 4545;
const app = _express();
const _ws = _expressWs(app);
const wss = _ws.getWss()
wss.on("connection", (ws, req) => {
    console.log("wss.on(connection)");
    console.log("ws", JSON.stringify(ws));
    console.log("----------")
    console.log();
    const ip = req.headers.origin.split("://")[1].split(":")[0];
    const data = { ip, connected: true };
    wss.clients.forEach(c => {
        c.send(JSON.stringify(data))
    })

    ws.on("message", msg => {
        //console.log("headers", req.headers)
        console.log("wss.on(messgae)", msg)
        const data = { ip, msg };
        wss.clients.forEach(c => {
            c.send(JSON.stringify(data))
        })
    })
    ws.on("close", ws => {
        console.log("wss.on(close)")
        const data = { ip, disconnected: true };
        wss.clients.forEach(c => {
            c.send(JSON.stringify(data))
        })
    })
    ws.on("error", err => {
        console.log("wss.on(error)", err)
        const data = { ip, err };
        wss.clients.forEach(c => {
            c.send(JSON.stringify(data))
        })
    })
})

_router
    .use("/", (req, res, next) => {
        console.log("_router onbegin", new Date(), req.path, req.method);
        console.log("========")
        return next()
    })
    .get("/env", (req, res, next) => {
        console.log("_router.get(/env)")
        console.log("========")
        res.status(200).send(process.env);
        return next();
    })
    .post("/item", (req, res, next) => {
        console.log("_router.post(/item)")
        console.log("========")
        if (req.body.err)
            req.body.undefined.prop;

        res.status(200).send(req.body);
        return next();
    })
    .use("/", (req, res) => {
        console.log("_router onend");
        console.log("========")
        console.log()
        res.end();
    });

app
    .use(_express.urlencoded({ extended: false }))
    .use(_express.json())
    .use(_router)
    // handle errors
    .use((err, req, res, next) => {
        console.log("_router onerror", err);
        console.log("========")
        res.status(500).send({
            message: err.message,
            stack: err.stack
        });
        return next();
    })
    .listen(port, () => {
        console.log(`listening on port ${port}`)
        console.log("===========")
    })