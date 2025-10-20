# Bloco para o domínio com HTTPS
server {
    listen 443 ssl;
    server_name klcmarket.shop www.klcmarket.shop;

    # Diretório do front-end (Quasar ou outro)
    root /var/www/quasar-klc;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/klcmarket.shop/fullchain.pem; # Certificado gerido pelo Certbot
    ssl_certificate_key /etc/letsencrypt/live/klcmarket.shop/privkey.pem; # Certificado gerido pelo Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # Gerenciado pelo Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # Gerenciado pelo Certbot

    # Configuração para o back-end (Laravel) no subdiretório /backend
    location /backend {
        root /var/www/laravel-klc/public; # Diretório público do Laravel
        index index.php index.html;
        try_files $uri $uri/ /index.php?$query_string;

        # Configuração para arquivos PHP
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Ajuste conforme a versão do PHP
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        # Negar acesso a arquivos ocultos (.htaccess, .env, etc.)
        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
    # Proxy para a API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/; # Endereço do back-end ou API
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Bloco para o IP com HTTP (apenas para testar)
server {
    listen 80;
    server_name 65.21.165.110;

    root /var/www/quasar-klc;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirecionamento de HTTP para HTTPS para o domínio
server {
    listen 80;
    server_name klcmarket.shop www.klcmarket.shop;
    return 301 https://$host$request_uri;
}
