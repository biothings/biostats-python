import tornado.ioloop
import tornado.web, tornado.template
import os

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./static/index.html')


if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/", MainHandler),
        (r"/static/js(.*)", tornado.web.StaticFileHandler, {
            "path": "./static/js"
        }),
        (r"/static/css(.*)", tornado.web.StaticFileHandler, {
            "path": "./static/css"
        }),
        (r"/img(.*)", tornado.web.StaticFileHandler, {
            "path": "./static/img"
        }),
    ], **settings)
    app.listen(8000)
    tornado.ioloop.IOLoop.current().start()
