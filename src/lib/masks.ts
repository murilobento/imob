export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 9)
}

export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18)
}

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .substring(0, 15)
}

export const maskCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '')
  const floatValue = Number(numericValue) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(floatValue)
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const maskRG = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 12) // XX.XXX.XXX-X
}

export const maskIE = (value: string, uf: string) => {
  const v = value.replace(/\D/g, '')
  if (!uf) return v

  switch (uf.toUpperCase()) {
    case 'AC':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3/$4-$5')
        .substring(0, 17)
    case 'AL':
      return v.replace(/^(\d{2})(\d{6})(\d{1})/, '$1.$2.$3-$4').substring(0, 11) // 24.123.456-7
    case 'AP':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12)
    case 'AM':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12)
    case 'BA':
      if (v.length === 8)
        return v.replace(/^(\d{6})(\d{2})/, '$1-$2').substring(0, 9)
      return v.replace(/^(\d{7})(\d{2})/, '$1-$2').substring(0, 10)
    case 'CE':
      return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10)
    case 'DF':
      return v
        .replace(/^(\d{3})(\d{5})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .substring(0, 17)
    case 'ES':
      return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-0
    case 'GO':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12) // 10.987.654-7
    case 'MA':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12) // 12.345.678-9
    case 'MT':
      return v.replace(/^(\d{10})(\d{1})/, '$1-$2').substring(0, 12) // 0013000001-9
    case 'MS':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12) // 28.123.456-8
    case 'MG':
      return v
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4')
        .substring(0, 17) // 062.307.904/0081
    case 'PA':
      return v.replace(/^(\d{2})(\d{6})(\d{1})/, '$1-$2-$3').substring(0, 12) // 15-123456-5
    case 'PB':
      return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-9
    case 'PR':
      return v.replace(/^(\d{3})(\d{5})(\d{2})/, '$1.$2-$3').substring(0, 13) // 123.45678-50
    case 'PE':
      return v.replace(/^(\d{7})(\d{2})/, '$1-$2').substring(0, 10) // 1234567-9
    case 'PI':
      return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10) // 12345678-9
    case 'RJ':
      return v
        .replace(/^(\d{2})(\d{3})(\d{2})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 11) // 12.345.67-8
    case 'RN':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12) // 20.123.456-7
    case 'RS':
      return v.replace(/^(\d{3})(\d{7})/, '$1/$2').substring(0, 11) // 123/4567890
    case 'RO':
      return v.replace(/^(\d{13})/, '$1').substring(0, 13) // Just digits as per example 2
    case 'RR':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12)
    case 'SC':
      return v.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3').substring(0, 11)
    case 'SP':
      return v
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4')
        .substring(0, 15)
    case 'SE':
      return v.replace(/^(\d{8})(\d{1})/, '$1-$2').substring(0, 10)
    case 'TO':
      return v
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .substring(0, 12)
    default:
      return v
  }
}
