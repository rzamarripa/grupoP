angular
  .module('casserole')
  .controller('DashboardCtrl', DashboardCtrl);
 
function DashboardCtrl($scope, $meteor, $reactive, $state, toastr) {
	let rc = $reactive(this).attach($scope);

	this.semanas = [];
	for(var i = 1; i <= 52; i++){
		this.semanas.push(i);
	}
	this.fechaInicio = new Date();
	this.fechaInicio.setHours(0,0,0,0);
	this.fechaFin = new Date();
	this.fechaFin.setHours(23,59,59,0);
	
	this.agencias_id = [];
	this.modelos_id = [];	
	this.semanaActual = moment(new Date()).isoWeek();
	this.anio = moment().get('year');
	this.graficaGastos = [];
	this.categorias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
	
	window.rc = rc;
	
	this.subscribe('agencias',()=>{
		return [{estatus : true}]
	});
		
	this.subscribe('bitacoraCorreos', ()  => {
		return [{ fecha : { $gte : this.getReactively("fechaInicio"), $lt : this.getReactively("fechaFin") }}];
	});

  this.helpers({
	  porAgencia : () => {
		  //Es la gráfica de pago que hacen los alumnos agrupada por grupos activos
		  var bitacoraCorreos = BitacoraCorreos.find().fetch();
		  this.totalCorreos = bitacoraCorreos.length;
		  var arreglo = {};
		  if(bitacoraCorreos){
			  _.each(bitacoraCorreos, function(bitacora){
					//Listado de Pagos realizados
					if(undefined == arreglo[bitacora.agencia_id]){
						arreglo[bitacora.agencia_id] = {};
						arreglo[bitacora.agencia_id].name = bitacora.agencia_id;
						arreglo[bitacora.agencia_id].data = 1;
					}else{
						arreglo[bitacora.agencia_id].data += 1;
					}	
			  });
			  
			  arreglo = _.toArray(arreglo);
			  _.each(arreglo, function(a){
				  var agencia = Agencias.findOne(a.name);
				  a.name = agencia.nombre;
			  })
			  console.log("arreglo", arreglo);
			  var valores = _.pluck(arreglo, "data");
			  var nombreGrupos = _.pluck(arreglo, "name");
		  }
			$('#porAgencia').highcharts( {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Correos por Agencia del ' + moment(rc.fechaInicio).format("DD-MM-YYYY") + ' al ' + moment(rc.fechaFin).format("DD-MM-YYYY")
        },
        xAxis: {
            categories: nombreGrupos
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: ''
            }
        },
        series: [{
            name: 'Agencias',
            data: valores
        }]
    	});
    	
		  return arreglo;
	  },
	  porAgenciaPorModelo : () => {
		  var bitacoraCarros = BitacoraCorreos.find().fetch();
		  var arreglo = {};
/*
			_.each(gastos, function(gasto){
				if(arreglo[gasto.tipoGasto] == undefined){
					arreglo[gasto.tipoGasto] = {};
					arreglo[gasto.tipoGasto].total = 0.00;
					arreglo[gasto.tipoGasto].data = {};
					for(var i = 0; i <= 7; i++){
						arreglo[gasto.tipoGasto].data = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
					}
					arreglo[gasto.tipoGasto].name = gasto.tipoGasto;
					console.log(gasto.importe);
					arreglo[gasto.tipoGasto].data[gasto.diaSemana - 1] = gasto.importe;
					arreglo[gasto.tipoGasto].total = gasto.importe;
				}else{
					var total = (arreglo[gasto.tipoGasto].data[gasto.diaSemana - 1] != undefined) ? arreglo[gasto.tipoGasto].data[gasto.diaSemana - 1] : 0.00;
					total += gasto.importe;
					arreglo[gasto.tipoGasto].data[gasto.diaSemana - 1] = total;
					arreglo[gasto.tipoGasto].total += total;
				}
			});
			
			arreglo = _.toArray(arreglo);
		  console.log(arreglo);
		  $('#porAgenciaPorModelo').highcharts( {
			  chart: {
            type: 'line'
        },
        title: {
            text: 'Relación de Gastos de la Semana ' + this.getReactively("semanaActual"),
            x: -20 //center
        },
        subtitle: {
            text: (rc.campus != undefined) ? rc.campus.nombre : '',
            x: -20
        },
        xAxis: {
            categories: this.categorias,
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'rgba(68, 170, 213, .2)'
            }]
        },
        yAxis: {
            title: {
                text: 'Gasto en $'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Pesos'
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: arreglo
	    });
		  return arreglo;
*/
	  }/*
,
	  semanales : () => {
		  return BitacoraCorreos.find({"planPagos.colegiatura.tipoColegiatura" : "Semanal"}).count();
	  },
	  quincenales : () => {
		  return BitacoraCorreos.find({"planPagos.colegiatura.tipoColegiatura" : "Quincenal"}).count();
	  },
	  mensuales : () => {
		  return BitacoraCorreos.find({"planPagos.colegiatura.tipoColegiatura" : "Mensual"}).count();
	  },
*/
  });
  
 
}
