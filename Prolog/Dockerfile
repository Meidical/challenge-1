FROM swipl:latest

# Copy the Prolog source files into the container
COPY . .

# Expose the port the server runs on
EXPOSE 8081

# Command to run the Prolog application
CMD ["swipl", "-q", "-f", "main.pl"]