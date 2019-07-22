const _express = require("express");
const _expressWs = require("express-ws");
const _router = _express.Router();

const port = process.env.PORT || 4545;
const app = _express();
const _ws = _expressWs(app);
const wss = _ws.getWss()
wss.on("connection", (ws, req) => {
    console.log("wss.once(connection)");
    console.log("ws", JSON.stringify(ws));
    console.log("----------")
    console.log();
    const ip = req.headers.origin.split("://")[1].split(":")[0];
    ws.on("message", msg => {
        //console.log("headers", req.headers)
        console.log("wss.on(messgae)", msg)
        const data = {
            member: ip,
            msg
        }
        console.log(data);
        wss.clients.forEach(c => {
            c.send(JSON.stringify(data))
        })
    })
    ws.on("close", ws => {
        console.log("wss.on(close)")
        const data = {
            member: ip,
            msg: "disconnected"
        }
        console.log(data);
        wss.clients.forEach(c => {
            c.send(JSON.stringify(data))
        })
    })
    ws.on("error", err => {
        console.log("wss.on(error)", err)
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
    // serve web-sockets requests
    /*
    .ws("/", (ws, req) => {
        console.log("app.ws(/)");
        ws.on("message", msg => {
            console.log("app.ws.on(message)", msg);
        })
    })
    */
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