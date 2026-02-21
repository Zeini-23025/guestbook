#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"

# ── Colors ───────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

log()  { echo -e "${GREEN}[✔]${RESET} $1"; }
warn() { echo -e "${YELLOW}[!]${RESET} $1"; }
info() { echo -e "${CYAN}[→]${RESET} $1"; }
err()  { echo -e "${RED}[✘]${RESET} $1"; }

# ══════════════════════════════════════════════════════════════
#  COMBINED
# ══════════════════════════════════════════════════════════════
run_all() {
  trap "echo -e '\n${YELLOW}Stopping...${RESET}'; kill 0" SIGINT
  info "Starting Docker (background)..."; (cd "$ROOT_DIR" && docker-compose up -d)
  log  "Docker is up."
  info "Starting Server...";              (cd "$SERVER_DIR" && npm start) &
  info "Starting Client...";              (cd "$CLIENT_DIR" && npm run dev) &
  wait
}

install_all() {
  info "Installing Server dependencies..."; (cd "$SERVER_DIR" && npm install)
  echo ""
  info "Installing Client dependencies..."; (cd "$CLIENT_DIR" && npm install)
  echo ""; log "All dependencies installed."
}

# ══════════════════════════════════════════════════════════════
#  DOCKER
# ══════════════════════════════════════════════════════════════
dc_up()   { info "Docker: starting (background)..."; (cd "$ROOT_DIR" && docker-compose up -d)   && log "Containers up."; }
dc_stop() { info "Docker: stopping all containers..."; docker stop $(docker ps -q) 2>/dev/null  && log "All containers stopped." || warn "No running containers."; }
dc_logs() { info "Docker: logs (Ctrl+C to exit)...";   (cd "$ROOT_DIR" && docker-compose logs -f); }

# ══════════════════════════════════════════════════════════════
#  SERVER (Node)
# ══════════════════════════════════════════════════════════════
s_start()   { info "Server: start";   (cd "$SERVER_DIR" && npm start); }
s_install() { info "Server: install"; (cd "$SERVER_DIR" && npm install); }
s_build()   { info "Server: build";   (cd "$SERVER_DIR" && npm run build); }

# ══════════════════════════════════════════════════════════════
#  CLIENT (React)
# ══════════════════════════════════════════════════════════════
c_run()     { info "Client: dev";     (cd "$CLIENT_DIR" && npm run dev); }
c_install() { info "Client: install"; (cd "$CLIENT_DIR" && npm install); }
c_build()   { info "Client: build";   (cd "$CLIENT_DIR" && npm run build); }

# ══════════════════════════════════════════════════════════════
#  MENU
# ══════════════════════════════════════════════════════════════
show_menu() {
  clear
  echo -e "${BOLD}${CYAN}"
  echo "  ╔══════════════════════════════╗"
  echo "  ║       Project Dev Console    ║"
  echo "  ╚══════════════════════════════╝"
  echo -e "${RESET}"
  echo -e "  ${BOLD}Combined${RESET}"
  echo "    1)  Run     — Docker + Server + Client"
  echo "    2)  Install — All dependencies"
  echo ""
  echo -e "  ${BOLD}Docker${RESET}"
  echo "    d1) Start (background)"
  echo "    d2) Stop  all containers"
  echo "    d3) Logs"
  echo ""
  echo -e "  ${BOLD}Server (Node)${RESET}"
  echo "    s1) Start    s2) Install    s3) Build"
  echo ""
  echo -e "  ${BOLD}Client (React)${RESET}"
  echo "    c1) Dev    c2) Install    c3) Build"
  echo ""
  echo -e "    q)  Quit"
  echo ""
  echo -ne "${CYAN}  Choose > ${RESET}"
  read -r choice

  case $choice in
    1) run_all ;;      2) install_all ;;
    d1) dc_up ;;       d2) dc_stop ;;     d3) dc_logs ;;
    s1) s_start ;;     s2) s_install ;;   s3) s_build ;;
    c1) c_run ;;       c2) c_install ;;   c3) c_build ;;
    q|Q) echo "Bye!"; exit 0 ;;
    *) warn "Unknown option. Try again."; sleep 1 ;;
  esac

  echo -e "\n${YELLOW}Press Enter to return to menu...${RESET}"
  read -r
  show_menu
}

# ══════════════════════════════════════════════════════════════
#  CLI  ./dev.sh [option]
# ══════════════════════════════════════════════════════════════
case "${1:-}" in
  all)       run_all ;;
  setup)     install_all ;;
  d:up)      dc_up ;;
  d:stop)    dc_stop ;;
  d:logs)    dc_logs ;;
  s:start)   s_start ;;
  s:install) s_install ;;
  s:build)   s_build ;;
  c:run)     c_run ;;
  c:install) c_install ;;
  c:build)   c_build ;;
  help|-h|--help)
    echo -e "${BOLD}Usage:${RESET} ./dev.sh [option]   (no option → interactive menu)"
    echo ""
    echo -e "  ${CYAN}all${RESET}          Docker (bg) + Server + Client"
    echo -e "  ${CYAN}setup${RESET}        Install all dependencies"
    echo ""
    echo -e "  ${CYAN}d:up${RESET}         docker-compose up -d"
    echo -e "  ${CYAN}d:stop${RESET}       docker stop \$(docker ps -q)"
    echo -e "  ${CYAN}d:logs${RESET}       docker-compose logs -f"
    echo ""
    echo -e "  ${CYAN}s:start${RESET}      Server npm start"
    echo -e "  ${CYAN}s:install${RESET}    Server npm install"
    echo -e "  ${CYAN}s:build${RESET}      Server npm run build"
    echo ""
    echo -e "  ${CYAN}c:run${RESET}        Client npm run dev"
    echo -e "  ${CYAN}c:install${RESET}    Client npm install"
    echo -e "  ${CYAN}c:build${RESET}      Client npm run build"
    ;;
  "") show_menu ;;
  *) err "Unknown option: $1"; echo "Run './dev.sh help' to see all options."; exit 1 ;;
esac