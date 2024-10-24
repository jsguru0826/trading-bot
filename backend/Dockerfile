FROM python:3.11.3

# Install .NET SDK (replace with the appropriate version)
RUN apt-get update && \
    apt-get install -y wget apt-transport-https && \
    wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y dotnet-sdk-6.0 && \
    rm packages-microsoft-prod.deb

RUN sudo apt-get install xvfb

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["xvfb-run -a python", "app.py"]
