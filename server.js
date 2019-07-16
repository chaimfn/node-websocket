const _express = require("express");
const _expressWs = require("express-ws");
const _wsRouter = _express.Router();
const _router = _express.Router();

const port = process.env.PORT || 4545;
const app = _express();
_expressWs(app);

_router
    /*
    .use("/", [
        (req, res, next) => {
            console.log("_router onbegin", req.path, req.method);
            return next()
        },
        (err, req, res) => {
            console.log("_router onerror", err);
            res.status(500).send(err)
        },
        (req, res) => {
            console.log("_router onend");
            res.status(200).end();
        }
    ])
    */
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
    })

/*
_wsRouter.ws("/", (ws, req) => {
    console.log("_wsRouter.ws(/)")
    ws.on("message", msg => {
        console.log("ws.on(message)", msg);
        ws.send(msg)
    })
})
*/

app
    .use(_express.urlencoded({ extended: false }))
    .use(_express.json())
    .use(_router)
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