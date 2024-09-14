package api

import "community-forum-backend/db"

var Store *db.Store

func RegisterStore(s *db.Store) {
	Store = s
}
