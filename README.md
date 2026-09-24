# Carvalho Motos

Loja estática da Carvalho Motos e Máquinas, em Caldas Novas (GO), com finalização pelo WhatsApp.

## Rodar localmente

Execute `python3 -m http.server 8000` nesta pasta e abra `http://localhost:8000`.

## Coolify

Crie uma aplicação a partir deste repositório, selecione **Dockerfile** como método de build e configure a porta **80**. Defina o domínio `carvalhomotos.meuapp.online` depois que DNS e proxy estiverem prontos.

O site não requer variáveis de ambiente nem banco de dados. O catálogo funciona no navegador: a lista de interesse é salva no dispositivo e a finalização abre uma mensagem pronta no WhatsApp da loja. Valores, estoque e cores são confirmados pela equipe.

A página inicial mostra um carrossel de modelos. A rota `/loja.html` oferece busca por nome, filtros de categoria, ordenação e paginação. Os filtros e a página atual são refletidos na URL para permitir links diretos.

## Fontes do conteúdo

- Arte `carvalho motos.png` fornecida na raiz do projeto (telefone, endereço, produtos, serviços e identidade visual).
- Publicações públicas de [@carvalhomotos](https://www.instagram.com/carvalhomotos/) e [fotos do Facebook](https://www.facebook.com/carvalho.motos.maq/photos), consultadas em 24/09/2026 pelo Chrome conectado. Foram verificadas 158 publicações recentes acessíveis por URL pública, além das fotos do Facebook. As fichas dos produtos levam à publicação correspondente.

Preços, estoque e horários não são exibidos porque não foram confirmados nas fontes.

- Fotos isoladas dos modelos Shineray: páginas oficiais da [Shineray](https://www.shineray.com.br/).
- Recorte da SHI 125 criado a partir da arte fornecida.
- Fotos isoladas da Capri, Ultra Max, Santorini R4 e da bicicleta ilustrativa Santorini R8: catálogo oficial da [Ultra Moove](https://revendas.ultramoove.com.br/).
- Imagens da AZ1 e AZ160 Xtreme: [Avelloz](https://www.avelloz.com.br/). Imagem do triciclo Rema: [Remacar](https://remacar.com.br/). Imagens de referência para os elétricos genéricos e para o triciclo Fox: catálogos de revendedores.

O catálogo reúne 24 fichas de modelos ou tipos de veículo identificados nas publicações. Quando a publicação informa só a potência ou a linha, a descrição marca a imagem como ilustrativa e pede confirmação do modelo exato. Publicações antigas não garantem estoque atual; toda compra começa com a confirmação da equipe.
