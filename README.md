# Carvalho Motos

Loja da Carvalho Motos e Máquinas, em Caldas Novas (GO), com catálogo administrável e finalização pelo WhatsApp.

## Rodar localmente

Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no ambiente (use `.env.example` como referência), instale `requirements.txt` e execute `uvicorn server:app --host 127.0.0.1 --port 8000`. Abra `http://localhost:8000` e o painel em `http://localhost:8000/admin`.

O primeiro início cria o banco SQLite em `DATA_DIR` e importa as 24 fichas existentes. A senha é armazenada como hash PBKDF2. Os produtos importados começam com disponibilidade **sob consulta**, pois as publicações antigas não confirmam estoque atual. O painel permite cadastrar, editar, excluir, ocultar, marcar disponível ou fora de estoque e enviar até oito imagens por produto. Fotos enviadas são convertidas para WebP. Produtos ocultos saem da loja; produtos fora de estoque aparecem sem ação de compra.

## Coolify

Crie uma aplicação a partir deste repositório, selecione **Dockerfile** como método de build e configure a porta **80**. Defina o domínio `carvalhomotos.meuapp.online` depois que DNS e proxy estiverem prontos. Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` como variáveis **de runtime**; não coloque a senha no repositório. Monte um volume persistente em `/data` **antes da primeira implantação** para guardar `catalog.sqlite3` e `uploads/`. Mantenha uma instância da aplicação (SQLite usa arquivo local) e faça backup periódico do volume.

O catálogo é lido da API do servidor. A lista de interesse continua salva no dispositivo e a finalização abre uma mensagem pronta no WhatsApp da loja. Valores e cores são confirmados pela equipe.

A página inicial mostra um carrossel de modelos. A rota `/loja` oferece busca por nome, filtros de categoria, ordenação e paginação. Os filtros e a página atual são refletidos na URL para permitir links diretos.

## Privacidade e anúncios

As páginas `/politica-de-privacidade`, `/politica-de-cookies` e `/termos-de-uso` descrevem o funcionamento atual da loja. O aviso de cookies oferece rejeição, aceitação e escolha separada para análise e publicidade. A preferência pode ser alterada pelo rodapé.

`consent.js` inicia os quatro sinais do Google Consent Mode (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) como `denied` e os atualiza após uma escolha. O estado também fica disponível em `window.CarvalhoConsent.get()` e no evento `carvalho:consent`. **Nenhum identificador ou tag do Google Ads, Analytics, AdSense ou Meta Pixel está instalado.** Ao configurar uma ferramenta, carregue suas tags conforme a preferência correspondente, registre conversões somente quando permitido e atualize as políticas com fornecedor, finalidade e prazo de armazenamento efetivos. Os links de compra enviam ao WhatsApp; por isso, um eventual evento de conversão no site representa um clique de contato, não uma venda concluída.

O destaque da primeira dobra alterna entre motos do catálogo a cada 5 segundos e guarda localmente o último modelo mostrado para evitar repeti-lo na próxima abertura. O carrossel do catálogo também avança a cada 5 segundos.

## Fontes do conteúdo

- Arte `carvalho motos.png` fornecida na raiz do projeto (telefone, endereço, produtos, serviços e identidade visual).
- Publicações públicas de [@carvalhomotos](https://www.instagram.com/carvalhomotos/) e [fotos do Facebook](https://www.facebook.com/carvalho.motos.maq/photos), consultadas em 24/09/2026 pelo Chrome conectado. Foram verificadas 158 publicações recentes acessíveis por URL pública, além das fotos do Facebook. As fichas dos produtos levam à publicação correspondente.

Preços, estoque e horários não são exibidos porque não foram confirmados nas fontes.

- Fotos isoladas dos modelos Shineray: páginas oficiais da [Shineray](https://www.shineray.com.br/).
- Recorte da SHI 125 criado a partir da arte fornecida.
- Fotos isoladas da Capri, Ultra Max, Santorini R4 e da bicicleta ilustrativa Santorini R8: catálogo oficial da [Ultra Moove](https://revendas.ultramoove.com.br/).
- Imagens da AZ1 e AZ160 Xtreme: [Avelloz](https://www.avelloz.com.br/). Imagem do triciclo Rema: [Remacar](https://remacar.com.br/). Imagens de referência para os elétricos genéricos e para o triciclo Fox: catálogos de revendedores.

O catálogo reúne 24 fichas de modelos ou tipos de veículo identificados nas publicações. Quando a publicação informa só a potência ou a linha, a descrição marca a imagem como ilustrativa e pede confirmação do modelo exato. Publicações antigas não garantem estoque atual; toda compra começa com a confirmação da equipe.

As menções a Rio 125 CDI e SHI 175 CDI foram registradas nas fichas das respectivas linhas, pois as versões EFI já têm fotos de catálogo isoladas e não há confirmação de estoque separado das versões CDI. Uma hashtag antiga menciona Jet 50cc sem identificar com segurança o modelo anunciado, por isso não gera uma ficha de compra.
