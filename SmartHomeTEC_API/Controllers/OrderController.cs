using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Order
        /// <summary>
        /// Obtiene todas las órdenes.
        /// </summary>
        /// <returns>Lista de OrderDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _context.Order
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<OrderDTO>>(orders);
        }

        // GET: api/Order/{orderID}
        /// <summary>
        /// Obtiene una orden específica por su ID.
        /// </summary>
        /// <param name="orderID">ID de la Orden</param>
        /// <returns>Objeto OrderDTO</returns>
        [HttpGet("{orderID}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int orderID)
        {
            var order = await _context.Order.FindAsync(orderID);

            if (order == null)
            {
                return NotFound();
            }

            return _mapper.Map<OrderDTO>(order);
        }

        // POST: api/Order
        /// <summary>
        /// Crea una nueva orden.
        /// </summary>
        /// <param name="createOrderDTO">Objeto CreateOrderDTO</param>
        /// <returns>Objeto OrderDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> PostOrder([FromBody] CreateOrderDTO createOrderDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar el estado de la orden
            if (!Enum.TryParse<OrderState>(createOrderDTO.State, out var orderState))
            {
                return BadRequest("Estado de la orden inválido. Valores permitidos: Ordered, Paid, Received.");
            }

            // Verificar si el Device existe
            var device = await _context.Device.FindAsync(createOrderDTO.SerialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo especificado no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(createOrderDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createOrderDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el Device ya tiene una Order
            var existingOrderForDevice = await _context.Order
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.SerialNumberDevice == createOrderDTO.SerialNumberDevice);
            if (existingOrderForDevice != null)
            {
                return BadRequest("Este dispositivo ya está asociado a una orden.");
            }

            // Calcular OrderClientNum
            int orderClientNum = 1;
            var clientOrdersCount = await _context.Order.CountAsync(o => o.ClientEmail == createOrderDTO.ClientEmail);
            if (clientOrdersCount > 0)
            {
                orderClientNum = clientOrdersCount + 1;
            }

            // Obtener Brand del Device
            string brand = device.Brand;

            // Calcular TotalPrice
            decimal totalPrice = device.Price;

            // Mapear DTO a Entidad
            var order = _mapper.Map<Order>(createOrderDTO);
            order.State = orderState;
            order.OrderClientNum = orderClientNum;
            order.Brand = brand;
            order.TotalPrice = totalPrice;

            _context.Order.Add(order);
            await _context.SaveChangesAsync();

            var createdOrderDTO = _mapper.Map<OrderDTO>(order);

            return CreatedAtAction(nameof(GetOrder), new { orderID = order.OrderID }, createdOrderDTO);
        }

        // PUT: api/Order/{orderID}
        /// <summary>
        /// Actualiza una orden existente.
        /// </summary>
        /// <param name="orderID">ID de la Orden a actualizar</param>
        /// <param name="orderDTO">Objeto OrderDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{orderID}")]
        public async Task<IActionResult> PutOrder(int orderID, OrderDTO orderDTO)
        {
            if (orderID != orderDTO.OrderID)
            {
                return BadRequest("El ID de la orden no coincide.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar el estado de la orden
            if (!Enum.TryParse<OrderState>(orderDTO.State, out var orderState))
            {
                return BadRequest("Estado de la orden inválido. Valores permitidos: Ordered, Paid, Received.");
            }

            // Verificar si la Orden existe
            var existingOrder = await _context.Order.FindAsync(orderID);
            if (existingOrder == null)
            {
                return NotFound("La orden especificada no existe.");
            }

            // Verificar si el Device existe
            var device = await _context.Device.FindAsync(orderDTO.SerialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo especificado no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(orderDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(orderDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el Device ya tiene otra Order (diferente a la actual)
            var existingOrderForDevice = await _context.Order
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.SerialNumberDevice == orderDTO.SerialNumberDevice && o.OrderID != orderID);
            if (existingOrderForDevice != null)
            {
                return BadRequest("Este dispositivo ya está asociado a otra orden.");
            }

            // Calcular OrderClientNum
            int orderClientNum = 1;
            var clientOrdersCount = await _context.Order.CountAsync(o => o.ClientEmail == orderDTO.ClientEmail && o.OrderID != orderID);
            if (clientOrdersCount > 0)
            {
                orderClientNum = clientOrdersCount + 1;
            }

            // Obtener Brand del Device
            string brand = device.Brand;

            // Calcular TotalPrice
            decimal totalPrice = device.Price;

            // Actualizar los campos de la orden existente
            existingOrder.State = orderState;
            existingOrder.OrderTime = orderDTO.OrderTime;
            existingOrder.OrderDate = orderDTO.OrderDate;
            existingOrder.OrderClientNum = orderClientNum;
            existingOrder.Brand = brand;
            existingOrder.SerialNumberDevice = orderDTO.SerialNumberDevice;
            existingOrder.DeviceTypeName = orderDTO.DeviceTypeName;
            existingOrder.TotalPrice = totalPrice;
            existingOrder.ClientEmail = orderDTO.ClientEmail;

            // Marcar la entidad como modificada
            _context.Entry(existingOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(orderID))
                {
                    return NotFound("La orden especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        // POST: api/Order/WithBill
        /// <summary>
        /// Crea una nueva orden y genera automáticamente una factura asociada.
        /// </summary>
        /// <param name="createOrderDTO">Objeto CreateOrderDTO con los datos de la orden.</param>
        /// <returns>Objeto OrderDTO creado junto con la factura asociada.</returns>
        [HttpPost("WithBill")]
        public async Task<ActionResult<OrderDTO>> PostOrderWithBill([FromBody] CreateOrderDTO createOrderDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar el estado de la orden
            if (!Enum.TryParse<OrderState>(createOrderDTO.State, out var orderState))
            {
                return BadRequest("Estado de la orden inválido. Valores permitidos: Ordered, Paid, Received.");
            }

            // Verificar si el Device existe
            var device = await _context.Device.FindAsync(createOrderDTO.SerialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo especificado no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(createOrderDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createOrderDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el Device ya tiene una Order
            var existingOrderForDevice = await _context.Order
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.SerialNumberDevice == createOrderDTO.SerialNumberDevice);
            if (existingOrderForDevice != null)
            {
                return BadRequest("Este dispositivo ya está asociado a una orden.");
            }

            // Calcular OrderClientNum
            int orderClientNum = 1;
            var clientOrdersCount = await _context.Order.CountAsync(o => o.ClientEmail == createOrderDTO.ClientEmail);
            if (clientOrdersCount > 0)
            {
                orderClientNum = clientOrdersCount + 1;
            }

            // Obtener Brand del Device
            string brand = device.Brand;

            // Calcular TotalPrice
            decimal totalPrice = device.Price;

            // Mapear DTO a Entidad Order
            var order = _mapper.Map<Order>(createOrderDTO);
            order.State = orderState;
            order.OrderClientNum = orderClientNum;
            order.Brand = brand;
            order.TotalPrice = totalPrice;

            // Iniciar una transacción para asegurar atomicidad
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Añadir y guardar la Order
                    _context.Order.Add(order);
                    await _context.SaveChangesAsync();

                    // Crear el DTO para Bill basado en la Order creada
                    var createBillDTO = new CreateBillDTO
                    {
                        BillDate = order.OrderDate, // Asegurar que BillDate coincide con OrderDate
                        BillTime = order.OrderTime, // Asegurar que BillTime coincide con OrderTime
                        DeviceTypeName = order.DeviceTypeName,
                        OrderID = order.OrderID
                    };

                    // Verificar que DeviceTypeName de la Bill coincida con el de la Order
                    if (!string.Equals(createBillDTO.DeviceTypeName, order.DeviceTypeName, StringComparison.OrdinalIgnoreCase))
                    {
                        // Si no coinciden, revertir la transacción y retornar error
                        await transaction.RollbackAsync();
                        return BadRequest("El tipo de dispositivo de la factura debe coincidir con el tipo de dispositivo de la orden.");
                    }

                    // Mapear CreateBillDTO a Entidad Bill con todas las propiedades requeridas
                    var bill = new Bill
                    {
                        BillDate = createBillDTO.BillDate,
                        BillTime = createBillDTO.BillTime,
                        DeviceTypeName = createBillDTO.DeviceTypeName,
                        OrderID = createBillDTO.OrderID,
                        Price = order.TotalPrice ?? 0,
                        DeviceType = deviceType, // Establecer la propiedad de navegación
                        Order = order // Establecer la propiedad de navegación
                    };

                    // Añadir y guardar la Bill
                    _context.Bill.Add(bill);
                    await _context.SaveChangesAsync();

                    // Confirmar la transacción
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // En caso de error, revertir la transacción y retornar error
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"Error al crear la orden y la factura: {ex.Message}");
                }
            }

            // Mapear la entidad Order creada a OrderDTO para la respuesta
            var createdOrderDTO = _mapper.Map<OrderDTO>(order);

            return CreatedAtAction(nameof(GetOrder), new { orderID = order.OrderID }, createdOrderDTO);
        }



        /// <summary>
        /// Verifica si una Orden existe por su ID.
        /// </summary>
        /// <param name="orderID">ID de la Orden</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool OrderExists(int orderID)
        {
            return _context.Order.Any(e => e.OrderID == orderID);
        }
    }
}