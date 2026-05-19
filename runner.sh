#!/bin/sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

help() {
  printf "Runner options:\n"
  printf "dev\t- (re)initialize development environment\n"
  printf "prod\t- (re)initialize production environment\n"
  printf "stop\t- shut down an environment\n"
  printf "destroy\t- remove environment\n"
  printf "help\t\t- show this message\n"
}

copy_env() (
  cd $PROJECT_DIR
  
  if [ ! -f ".env" ]; then
    cp .env.example .env
  fi
)

stop() {
}

dev() {
  stop
  copy_env
}

prod() {
  (stop)
}

case "$1" in
  (dev) dev;;
  (prod) prod;;
  (stop) stop;;
  (destroy) destroy;;
  (*) help;;
esac

exit 0