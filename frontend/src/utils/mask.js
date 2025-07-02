export function aplicarMascaraCPF(valor) {
  return valor
    .replace(/\D/g, '')             
    .slice(0, 11)                   
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function aplicarMascaraCNPJ(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function aplicarMascaraTelefone(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2')
}

export function aplicarMascaraCEP(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export function aplicarMascaraMoeda(valor) {
  const numeros = valor.replace(/\D/g, '')
  const valorFloat = (parseInt(numeros, 10) / 100).toFixed(2)
  return `R$ ${valorFloat.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}
