package token

import (
	"errors"

	"github.com/mct-joken/kojs5-backend/pkg/utils/id"
)

type JWTTokenParser struct {
	key string
}

func NewJWTTokenParser(key string) *JWTTokenParser {
	return &JWTTokenParser{key: key}
}

// Parse トークンからユーザー情報を抜き出す
func (g *JWTTokenParser) Parse(token string) (id.SnowFlakeID, error) {
	t, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(g.key), nil
	})
	if err != nil {
		return "", errors.New("failed to parse token")
	}

	if !t.Valid {
		return "", errors.New("token is invalid")
	}

	subject, err := t.Claims.GetSubject()
	if err != nil {
		return "", err
	}

	return id.SnowFlakeID(subject), nil
}
