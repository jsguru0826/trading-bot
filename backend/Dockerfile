FROM python:3.11.3

# Install .NET SDK (replace with the appropriate version)
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://dotnet.microsoft.com/download/dotnet/6.0/thank-you/sdk-6.0.100-linux-x64-binaries -O dotnet.tar.gz && \
    mkdir -p /usr/share/dotnet && \
    tar zxf dotnet.tar.gz -C /usr/share/dotnet && \
    rm dotnet.tar.gz && \
    ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
