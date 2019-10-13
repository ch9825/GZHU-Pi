package main

import (
	"GZHU-Pi/env"
	"GZHU-Pi/routers"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
)

type App struct {
	Client *http.Client
	Config []string
	Router []http.Handler
}

func (app *App) InitApp() error {

	return nil
}

func main() {

	_ = env.InitLogger()

	r := mux.NewRouter()
	r = r.PathPrefix("/api/v1").Subrouter()

	//微信公众号接口
	//r.HandleFunc("/wx/check", routers.ErrorHandler(routers.WeChatCheck))
	//r.HandleFunc("/wx/check", routers.ErrorHandler(routers.Hello))

	//教务系统
	r.HandleFunc("/course", routers.ErrorHandler(routers.JWMiddleWare(routers.Course))).Methods("POST")
	r.HandleFunc("/exam", routers.ErrorHandler(routers.JWMiddleWare(routers.Exam))).Methods("POST")
	r.HandleFunc("/grade", routers.ErrorHandler(routers.JWMiddleWare(routers.Grade))).Methods("POST")
	r.HandleFunc("/room", routers.ErrorHandler(routers.JWMiddleWare(routers.EmptyRoom))).Methods("POST")

	//图书馆
	r.HandleFunc("/library/search", routers.ErrorHandler(routers.BookSearch)).Methods("GET")
	r.HandleFunc("/library/holdings", routers.ErrorHandler(routers.BookHoldings)).Methods("GET")

	//r.HandleFunc("/empty-room", test).Methods("POST")
	//r.HandleFunc("/exp", test).Methods("POST")
	//r.HandleFunc("/exam/schedule", test).Methods("POST")
	//r.HandleFunc("/exam/cet", test).Methods("POST")
	//r.HandleFunc("/exam/chinese", test).Methods("POST")
	//

	http.Handle("/", r)
	//获取阿里云函数计算容器端口
	port := os.Getenv("FC_SERVER_PORT")
	if port == "" {
		port = "9000"
	}
	fmt.Println("Server on port: " + port)
	err1 := http.ListenAndServe(":"+port, r)
	if err1 != nil {
		log.Print(err1)
		return
	}
}