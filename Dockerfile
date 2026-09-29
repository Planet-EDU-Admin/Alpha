FROM python:3.14-slim

WORKDIR /app
COPY . /app

ENV HOST=0.0.0.0 \
    PORT=4173 \
    PYTHONDONTWRITEBYTECODE=1

RUN useradd --system --uid 10001 alfa && chown -R alfa:alfa /app
USER alfa

EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:4173/healthz', timeout=2)"

CMD ["python", "server.py"]
