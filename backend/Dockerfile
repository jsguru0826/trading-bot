FROM python:3.11.3

RUN apt-get update && \
    apt-get install -y wget apt-transport-https gnupg2 && \
    wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y dotnet-sdk-6.0 xvfb && \
    rm packages-microsoft-prod.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["xvfb-run", "-a", "python", "app.py"]
