# EDUZZ - Api Ecommerce JavaScript

Solução criada pela Eduzz com o objetivo de fornecer uma implementação fácil e rápida para criação de conteúdos de valores variáveis.

- Altere o valor do seu Produto;
- Altere informações básicas do seu Produto;
- Receba informaões básicas dos seus clientes;

# Implementação 

\
A *Api Ecommerce JavaScript* fornecida pela *Eduzz* necessita apenas de **HTML e JavaScript, padrão em qualquer webpage**.

Faça o download deste repositório e **inclua no seu projeto o arquivo** `/dist/index.min.js`.

```html
<html>
    ...
    <body>
        ...
        <script type="text/javascript" src="dist/index.min.js"></script>
    </body>
</html>
```

### Formulário de Dados
Seu site irá receber as informações em JavaScript através de um formulário em HTML.

- No caso de doações o valor do produto pode ser recebido através do formulário
- Você também pode definir o valor através configurações 

### Formulário

| Input | Descrição | Validação Obrigatória |
| ------ | ------ | ------ |
| edz-name |Nome e Sobrenome do cliente | ```\w+\s+\w``` |
| edz-email | E-mail do cliente | ```^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$``` |
| edz-cellphone | Telefone do cliente |```^(?:(?:\+\|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d\|[2-9])\d{3})\-?(\d{4}))$``` | 
| edz-document | CPF do cliente | ```^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}\|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$``` |
| edz-price | Valor de venda do Produto | ```^[1-9]\d*(\.\d+)?$``` |

### Exemplo de implementação

```html
<form id="payment_form">
    <label for='edz-name'>Digite seu nome</label>
    <input type='text' name='edz-name' id='edz-name'/>

    <label for='edz-email'>Digite seu email</label>
    <input type='email' name='edz-email' id='edz-email'/>

    <label for='edz-cellphone'>Digite seu telefone</label>
    <input type='tel' name='edz-cellphone' id='edz-cellphone'/>

    <label for='edz-document'>Digite seu documento</label>
    <input type='text' name='edz-document' id='edz-document'/>

    <label for='edz-price'>VALOR</label>
    <input type='text' name='edz-price' id='edz-price'/>

    <button type='submit' name='btn_login'>PAGAR</button>
</form>
<script type="text/javascript">

    var form = document.getElementById("payment_form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        pay(event);
    });

    function pay(event) {
        var jsonFormData = eduzzPayment.formDataToJson(event.target);

        eduzzPayment.setConfig({
            returnUrl: 'https://meusite.com/retorno/minha-pagina-de-obrigado/',
            postbackUrl: 'https://meusite.com/postback/',
            queryParams: {
                skip: 1
            },
            productId: 10000,
            checkoutProductId: 100000, 
            description: 'Valor Editável',
            secret: '922ec9531b1f94add983a8ce2ebdc97b',
        });
    
        const formData = {
            name: jsonFormData.name,
            email: jsonFormData.email,
            document: jsonFormData.document,
            cellphone: jsonFormData.cellphone,
            price: jsonFormData.price,
        }
  
        eduzzPayment.pay(formData);
}
</script>
```

### Exemplo passando apenas o valor do produto

```html
<form id="payment_form">
    <label for='edz-price'>VALOR</label>
    <input type='text' name='edz-price' id='edz-price'/>

    <button type='submit' name='btn_login'>PAGAR</button>
</form>
<script type="text/javascript">


    var form = document.getElementById("payment_form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        pay(event);
    });

    function pay(event) {
        var jsonFormData = eduzzPayment.formDataToJson(event.target);

        eduzzPayment.setConfig({
            returnUrl: 'https://meusite.com/retorno/minhapagina-de-obrigado/',
            postbackUrl: 'https://meusite.com/postback/',
            productId: 10000, 
            checkoutProductId: 100000, 
            description: 'Valor Editável',
            secret: '922ec9531b1f94add983a8ce2ebdc97b',
        });

        var formData = {
            price: Number(jsonFormData.price),
        }

        eduzzPayment.pay(formData);
    }
</script>
```

### Configuração de envio

Ao chamar a função `eduzzPayment.setConfig({ ... })` vocˆê dever'á passar os seguintes parâmetros preenchidos:

| Configuração | Descrição |
| ------ | ------ |
| returnUrl | URL de Retorno, é o endereço que o usuário irá ao sair do Checkout |
| postbackUrl | Informações sobre o pagamento serão enviadas para esta URL |
| queryParams | Objecto JSON com as informações que irão ser passadas pela URL |
| productId | ID do seu Produto na Eduzz |
| checkoutProductId | É o VersionId de seu produto, https://sun.eduzz.com/productVersion/{ProductID} |
| description | Descrição da venda, o título que será exibido |
| secret | Chave fornecida pela Eduzz para operar com o ecommerce |

*Todas as informações podem ser fornecidas pelo suporte da Eduzz.*

### API Function Calback

Através de uma função JavaScript assinada para a `eduzzPayment.pay(event, ErrorHandlerCallbackFunction)` você pode tratar as respostas retornadas pela API de Pagamentos da Eduzz.
```html
...
<form onsubmit="eduzzPayment.pay(event, ErrorHandlerCallbackFunction)">
 ...
 
<script type="text/javascript">
    ErrorHandlerCallbackFunction(returnedData) {
        // Fazer alguma ação com o retorno 
    }
</script>
...
```
