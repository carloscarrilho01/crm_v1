import { useCallback, useRef } from 'react'

const STATUS_LABELS = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  aguardando_peca: 'Aguardando Peca',
  aguardando_aprovacao: 'Aguardando Aprovacao',
  aprovada: 'Aprovada',
  concluida: 'Concluida',
  entregue: 'Entregue',
  cancelada: 'Cancelada'
}

const PRIORIDADE_LABELS = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente'
}

function OSPdfGenerator({ order, onClose }) {
  const printRef = useRef(null)

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const handlePrint = useCallback(() => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>OS ${order.numeroOs}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 20px;
          }
          .os-pdf-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .os-pdf-header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .os-pdf-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .os-pdf-header .os-number {
            font-size: 18px;
            color: #555;
          }
          .os-pdf-header .os-date {
            font-size: 11px;
            color: #777;
            margin-top: 5px;
          }
          .os-pdf-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            gap: 20px;
          }
          .os-pdf-info-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            color: #fff;
          }
          .os-pdf-section {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
          }
          .os-pdf-section-title {
            background: #f5f5f5;
            padding: 8px 12px;
            font-weight: bold;
            font-size: 13px;
            border-bottom: 1px solid #ddd;
          }
          .os-pdf-section-content {
            padding: 12px;
          }
          .os-pdf-field {
            display: flex;
            margin-bottom: 6px;
          }
          .os-pdf-field label {
            font-weight: bold;
            min-width: 120px;
            color: #555;
          }
          .os-pdf-field span {
            flex: 1;
          }
          .os-pdf-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .os-pdf-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .os-pdf-table th, .os-pdf-table td {
            border: 1px solid #ddd;
            padding: 6px 10px;
            text-align: left;
          }
          .os-pdf-table th {
            background: #f5f5f5;
            font-weight: bold;
          }
          .os-pdf-table tfoot td {
            font-weight: bold;
            background: #f9f9f9;
          }
          .os-pdf-total {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .os-pdf-footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .os-pdf-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }
          .os-pdf-signature {
            text-align: center;
            width: 200px;
          }
          .os-pdf-signature-line {
            border-top: 1px solid #333;
            margin-bottom: 5px;
          }
          .os-pdf-garantia {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="os-pdf-container">
          <div class="os-pdf-header">
            <h1>ORDEM DE SERVICO</h1>
            <div class="os-number">${order.numeroOs}</div>
            <div class="os-date">Emitida em: ${formatDate(order.dataEntrada)} | Status: ${STATUS_LABELS[order.status]} | Prioridade: ${PRIORIDADE_LABELS[order.prioridade]}</div>
          </div>

          <div class="os-pdf-grid">
            <div class="os-pdf-section">
              <div class="os-pdf-section-title">DADOS DO CLIENTE</div>
              <div class="os-pdf-section-content">
                <div class="os-pdf-field"><label>Nome:</label><span>${order.clienteNome}</span></div>
                <div class="os-pdf-field"><label>Telefone:</label><span>${order.clienteTelefone || '-'}</span></div>
                <div class="os-pdf-field"><label>Email:</label><span>${order.clienteEmail || '-'}</span></div>
                <div class="os-pdf-field"><label>Endereco:</label><span>${order.clienteEndereco || '-'}</span></div>
                <div class="os-pdf-field"><label>CPF/CNPJ:</label><span>${order.clienteCpfCnpj || '-'}</span></div>
              </div>
            </div>

            <div class="os-pdf-section">
              <div class="os-pdf-section-title">EQUIPAMENTO</div>
              <div class="os-pdf-section-content">
                <div class="os-pdf-field"><label>Equipamento:</label><span>${order.equipamento || '-'}</span></div>
                <div class="os-pdf-field"><label>Marca:</label><span>${order.marca || '-'}</span></div>
                <div class="os-pdf-field"><label>Modelo:</label><span>${order.modelo || '-'}</span></div>
                <div class="os-pdf-field"><label>N Serie:</label><span>${order.numeroSerie || '-'}</span></div>
              </div>
            </div>
          </div>

          <div class="os-pdf-section">
            <div class="os-pdf-section-title">SERVICO</div>
            <div class="os-pdf-section-content">
              <div class="os-pdf-field"><label>Descricao:</label><span>${order.descricao}</span></div>
              ${order.diagnostico ? `<div class="os-pdf-field"><label>Diagnostico:</label><span>${order.diagnostico}</span></div>` : ''}
              ${order.solucao ? `<div class="os-pdf-field"><label>Solucao:</label><span>${order.solucao}</span></div>` : ''}
              ${order.observacoes ? `<div class="os-pdf-field"><label>Observacoes:</label><span>${order.observacoes}</span></div>` : ''}
              <div class="os-pdf-field"><label>Tecnico:</label><span>${order.tecnicoNome || '-'}</span></div>
              <div class="os-pdf-field"><label>Previsao:</label><span>${formatDate(order.dataPrevisao)}</span></div>
            </div>
          </div>

          ${order.itens && order.itens.length > 0 ? `
          <div class="os-pdf-section">
            <div class="os-pdf-section-title">ITENS / SERVICOS</div>
            <div class="os-pdf-section-content">
              <table class="os-pdf-table">
                <thead>
                  <tr>
                    <th>Descricao</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.itens.map(item => `
                    <tr>
                      <td>${item.descricao}</td>
                      <td>${item.quantidade}</td>
                      <td>${formatCurrency(item.valorUnitario)}</td>
                      <td>${formatCurrency(item.quantidade * item.valorUnitario)}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3">Total Itens</td>
                    <td>${formatCurrency(order.itens.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          ` : ''}

          <div class="os-pdf-section">
            <div class="os-pdf-section-title">VALORES</div>
            <div class="os-pdf-section-content">
              <div class="os-pdf-field"><label>Servico:</label><span>${formatCurrency(order.valorServico)}</span></div>
              <div class="os-pdf-field"><label>Pecas:</label><span>${formatCurrency(order.valorPecas)}</span></div>
              <div class="os-pdf-field"><label>Desconto:</label><span>${formatCurrency(order.desconto)}</span></div>
              <div class="os-pdf-field"><label>Pagamento:</label><span>${order.formaPagamento || '-'}</span></div>
            </div>
          </div>

          <div class="os-pdf-total">
            VALOR TOTAL: ${formatCurrency(order.valorTotal)}
          </div>

          <div class="os-pdf-footer">
            <div class="os-pdf-garantia">
              <strong>TERMO DE GARANTIA:</strong> Este servico possui garantia de ${order.garantiaDias || 90} dias a partir da data de entrega,
              cobrindo defeitos relacionados ao servico executado. A garantia nao cobre mau uso, danos fisicos,
              ou problemas nao relacionados ao servico realizado. Para acionar a garantia, apresente esta ordem de servico.
            </div>

            <div class="os-pdf-signatures">
              <div class="os-pdf-signature">
                <div class="os-pdf-signature-line"></div>
                <span>Responsavel Tecnico</span>
              </div>
              <div class="os-pdf-signature">
                <div class="os-pdf-signature-line"></div>
                <span>Cliente</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }, [order])

  return (
    <div className="os-modal-overlay" onClick={onClose}>
      <div className="os-pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="os-modal-header">
          <h2>Imprimir OS - {order.numeroOs}</h2>
          <button className="os-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <div className="os-pdf-preview" ref={printRef}>
          <div className="os-pdf-preview-content">
            <div className="os-pdf-preview-header">
              <h2>ORDEM DE SERVICO</h2>
              <p className="os-pdf-preview-number">{order.numeroOs}</p>
              <p className="os-pdf-preview-date">
                Emitida em: {formatDate(order.dataEntrada)} | Status: {STATUS_LABELS[order.status]}
              </p>
            </div>

            <div className="os-pdf-preview-section">
              <h3>Cliente</h3>
              <p><strong>Nome:</strong> {order.clienteNome}</p>
              <p><strong>Telefone:</strong> {order.clienteTelefone || '-'}</p>
              <p><strong>Email:</strong> {order.clienteEmail || '-'}</p>
            </div>

            <div className="os-pdf-preview-section">
              <h3>Equipamento</h3>
              <p>{order.equipamento || '-'} - {order.marca || ''} {order.modelo || ''}</p>
              {order.numeroSerie && <p><strong>S/N:</strong> {order.numeroSerie}</p>}
            </div>

            <div className="os-pdf-preview-section">
              <h3>Servico</h3>
              <p>{order.descricao}</p>
            </div>

            <div className="os-pdf-preview-section">
              <h3>Valor Total</h3>
              <p className="os-pdf-preview-total">{formatCurrency(order.valorTotal)}</p>
            </div>
          </div>
        </div>

        <div className="os-modal-footer">
          <button type="button" className="os-btn os-btn-cancel" onClick={onClose}>
            Fechar
          </button>
          <button type="button" className="os-btn os-btn-print" onClick={handlePrint}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
            </svg>
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default OSPdfGenerator
