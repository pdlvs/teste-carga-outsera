import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 500 },  // Vai de 0 a 500 usuários no período de 1 minuto
    { duration: '3m', target: 500 },  // Mantém 500 usuários ativos por 3 minutos
    { duration: '1m', target: 0 },    // Volta para 0 usuários em 1 minuto
  ],
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status é 200': (r) => r.status === 200, //Verifica se o status de resposta é 200
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500, //Verifica se o tempo de resposta é menor que 500ms
  });

  sleep(1);  // Pausa de 1 segundo entre as requisições para cada usuário, para simular um cenario mais realista
}

export function generateReport(data) {
    return {
      "report.html": htmlReport(data),
    };
}
