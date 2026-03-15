FROM ollama/ollama:latest

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Ollama default port
EXPOSE 11434

ENTRYPOINT ["/entrypoint.sh"]