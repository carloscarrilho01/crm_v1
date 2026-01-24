import { useState, useCallback, useEffect } from 'react'
import { API_URL } from '../config/api'

function CreateEditOS({ order, onSave, onClose }) {
  const isEditing = !!order?.id

  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    clienteEndereco: '',
    clienteCpfCnpj: '',
    descricao: '',
    observacoes: '',
    diagnostico: '',
    solucao: '',
    equipamento: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    tecnicoNome: '',
    valorServico: '',
    valorPecas: '',
    desconto: '',
    formaPagamento: 'dinheiro',
    status: 'aberta',
    prioridade: 'normal',
    garantiaDias: 90,
    dataPrevisao: '',
    itens: []
  })

  const [activeTab, setActiveTab] = useState('cliente')
  const [novoItem, setNovoItem] = useState({ descricao: '', quantidade: 1, valorUnitario: '' })

  useEffect(() => {
    if (order) {
      setFormData({
        clienteNome: order.clienteNome || '',
        clienteTelefone: order.clienteTelefone || '',
        clienteEmail: order.clienteEmail || '',
        clienteEndereco: order.clienteEndereco || '',
        clienteCpfCnpj: order.clienteCpfCnpj || '',
        descricao: order.descricao || '',
        observacoes: order.observacoes || '',
        diagnostico: order.diagnostico || '',
        solucao: order.solucao || '',
        equipamento: order.equipamento || '',
        marca: order.marca || '',
        modelo: order.modelo || '',
        numeroSerie: order.numeroSerie || '',
        tecnicoNome: order.tecnicoNome || '',
        valorServico: order.valorServico || '',
        valorPecas: order.valorPecas || '',
        desconto: order.desconto || '',
        formaPagamento: order.formaPagamento || 'dinheiro',
        status: order.status || 'aberta',
        prioridade: order.prioridade || 'normal',
        garantiaDias: order.garantiaDias || 90,
        dataPrevisao: order.dataPrevisao ? order.dataPrevisao.slice(0, 10) : '',
        itens: order.itens || []
      })
    }
  }, [order])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleAddItem = useCallback(() => {
    if (!novoItem.descricao || !novoItem.valorUnitario) return

    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, {
        descricao: novoItem.descricao,
        quantidade: parseInt(novoItem.quantidade) || 1,
        valorUnitario: parseFloat(novoItem.valorUnitario) || 0
      }]
    }))
    setNovoItem({ descricao: '', quantidade: 1, valorUnitario: '' })
  }, [novoItem])

  const handleRemoveItem = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }))
  }, [])

  const calcularTotal = useCallback(() => {
    const servico = parseFloat(formData.valorServico) || 0
    const pecas = parseFloat(formData.valorPecas) || 0
    const desc = parseFloat(formData.desconto) || 0
    const itensTotal = formData.itens.reduce((sum, item) =>
      sum + (item.quantidade * item.valorUnitario), 0
    )
    return servico + pecas + itensTotal - desc
  }, [formData.valorServico, formData.valorPecas, formData.desconto, formData.itens])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    if (!formData.clienteNome.trim() || !formData.descricao.trim()) {
      alert('Nome do cliente e descricao sao obrigatorios')
      return
    }

    const data = {
      ...formData,
      valorTotal: calcularTotal()
    }

    if (isEditing) {
      data.id = order.id
    }

    onSave(data)
  }, [formData, isEditing, order, onSave, calcularTotal])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  return (
    <div className="os-modal-overlay" onClick={onClose}>
      <div className="os-modal" onClick={(e) => e.stopPropagation()}>
        <div className="os-modal-header">
          <h2>{isEditing ? `Editar OS ${order.numeroOs}` : 'Nova Ordem de Servico'}</h2>
          <button className="os-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <div className="os-modal-tabs">
          <button
            className={`os-tab ${activeTab === 'cliente' ? 'active' : ''}`}
            onClick={() => setActiveTab('cliente')}
          >
            Cliente
          </button>
          <button
            className={`os-tab ${activeTab === 'equipamento' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipamento')}
          >
            Equipamento
          </button>
          <button
            className={`os-tab ${activeTab === 'servico' ? 'active' : ''}`}
            onClick={() => setActiveTab('servico')}
          >
            Servico
          </button>
          <button
            className={`os-tab ${activeTab === 'itens' ? 'active' : ''}`}
            onClick={() => setActiveTab('itens')}
          >
            Itens
          </button>
          <button
            className={`os-tab ${activeTab === 'valores' ? 'active' : ''}`}
            onClick={() => setActiveTab('valores')}
          >
            Valores
          </button>
        </div>

        <form onSubmit={handleSubmit} className="os-modal-form">
          {/* Tab: Cliente */}
          {activeTab === 'cliente' && (
            <div className="os-form-section">
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Nome do Cliente *</label>
                  <input
                    type="text"
                    name="clienteNome"
                    value={formData.clienteNome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="os-form-group">
                  <label>CPF/CNPJ</label>
                  <input
                    type="text"
                    name="clienteCpfCnpj"
                    value={formData.clienteCpfCnpj}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="clienteTelefone"
                    value={formData.clienteTelefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="os-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="clienteEmail"
                    value={formData.clienteEmail}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="os-form-group">
                <label>Endereco</label>
                <input
                  type="text"
                  name="clienteEndereco"
                  value={formData.clienteEndereco}
                  onChange={handleChange}
                  placeholder="Rua, numero, bairro, cidade"
                />
              </div>
            </div>
          )}

          {/* Tab: Equipamento */}
          {activeTab === 'equipamento' && (
            <div className="os-form-section">
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Equipamento</label>
                  <input
                    type="text"
                    name="equipamento"
                    value={formData.equipamento}
                    onChange={handleChange}
                    placeholder="Ex: Notebook, Impressora, Celular..."
                  />
                </div>
                <div className="os-form-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Ex: Dell, HP, Samsung..."
                  />
                </div>
              </div>
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Modelo do equipamento"
                  />
                </div>
                <div className="os-form-group">
                  <label>Numero de Serie</label>
                  <input
                    type="text"
                    name="numeroSerie"
                    value={formData.numeroSerie}
                    onChange={handleChange}
                    placeholder="S/N do equipamento"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Servico */}
          {activeTab === 'servico' && (
            <div className="os-form-section">
              <div className="os-form-group">
                <label>Descricao do Servico *</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o servico a ser realizado..."
                  rows={3}
                  required
                />
              </div>
              <div className="os-form-group">
                <label>Diagnostico</label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  placeholder="Diagnostico do problema..."
                  rows={2}
                />
              </div>
              <div className="os-form-group">
                <label>Solucao Aplicada</label>
                <textarea
                  name="solucao"
                  value={formData.solucao}
                  onChange={handleChange}
                  placeholder="Solucao implementada..."
                  rows={2}
                />
              </div>
              <div className="os-form-group">
                <label>Observacoes</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observacoes adicionais..."
                  rows={2}
                />
              </div>
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Tecnico Responsavel</label>
                  <input
                    type="text"
                    name="tecnicoNome"
                    value={formData.tecnicoNome}
                    onChange={handleChange}
                    placeholder="Nome do tecnico"
                  />
                </div>
                <div className="os-form-group">
                  <label>Prioridade</label>
                  <select name="prioridade" value={formData.prioridade} onChange={handleChange}>
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="aberta">Aberta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="aguardando_peca">Aguardando Peca</option>
                    <option value="aguardando_aprovacao">Aguardando Aprovacao</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="concluida">Concluida</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="os-form-group">
                  <label>Data Previsao</label>
                  <input
                    type="date"
                    name="dataPrevisao"
                    value={formData.dataPrevisao}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="os-form-group">
                <label>Garantia (dias)</label>
                <input
                  type="number"
                  name="garantiaDias"
                  value={formData.garantiaDias}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Tab: Itens */}
          {activeTab === 'itens' && (
            <div className="os-form-section">
              <h3>Adicionar Item/Servico</h3>
              <div className="os-form-row os-item-row">
                <div className="os-form-group os-item-desc">
                  <input
                    type="text"
                    value={novoItem.descricao}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descricao do item"
                  />
                </div>
                <div className="os-form-group os-item-qty">
                  <input
                    type="number"
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: e.target.value }))}
                    placeholder="Qtd"
                    min="1"
                  />
                </div>
                <div className="os-form-group os-item-price">
                  <input
                    type="number"
                    step="0.01"
                    value={novoItem.valorUnitario}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: e.target.value }))}
                    placeholder="Valor R$"
                  />
                </div>
                <button type="button" className="os-btn os-btn-add-item" onClick={handleAddItem}>
                  +
                </button>
              </div>

              {formData.itens.length > 0 && (
                <div className="os-itens-list">
                  <table className="os-itens-table-modal">
                    <thead>
                      <tr>
                        <th>Descricao</th>
                        <th>Qtd</th>
                        <th>Valor</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.itens.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.descricao}</td>
                          <td>{item.quantidade}</td>
                          <td>{formatCurrency(item.valorUnitario)}</td>
                          <td>{formatCurrency(item.quantidade * item.valorUnitario)}</td>
                          <td>
                            <button
                              type="button"
                              className="os-btn-remove-item"
                              onClick={() => handleRemoveItem(idx)}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total Itens:</strong></td>
                        <td colSpan="2">
                          <strong>
                            {formatCurrency(formData.itens.reduce((sum, item) =>
                              sum + (item.quantidade * item.valorUnitario), 0
                            ))}
                          </strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Valores */}
          {activeTab === 'valores' && (
            <div className="os-form-section">
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Valor do Servico (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valorServico"
                    value={formData.valorServico}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="os-form-group">
                  <label>Valor das Pecas (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valorPecas"
                    value={formData.valorPecas}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="os-form-row">
                <div className="os-form-group">
                  <label>Desconto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="desconto"
                    value={formData.desconto}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="os-form-group">
                  <label>Forma de Pagamento</label>
                  <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange}>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartao de Credito</option>
                    <option value="cartao_debito">Cartao de Debito</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>
              <div className="os-total-display">
                <span>Total:</span>
                <strong>{formatCurrency(calcularTotal())}</strong>
              </div>
            </div>
          )}

          <div className="os-modal-footer">
            <button type="button" className="os-btn os-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="os-btn os-btn-save">
              {isEditing ? 'Salvar Alteracoes' : 'Criar OS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEditOS
