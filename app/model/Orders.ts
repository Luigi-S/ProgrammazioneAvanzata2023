import { Model, DataTypes } from "sequelize";

import { SingletonDB } from "./sequelize";
const sequelize = SingletonDB.getInstance().getConnection();

// enum dei possibili stati dell'ordine
export enum OrderState {
    CREATO ='CREATO',                 // creato, ma non preso in carico -> start=null
    IN_ESECUZIONE ='IN ESECUZIONE',   // preso in carico, start valorizzata, finish=null
    FALLITO = 'FALLITO',              // qualche carico associato non è stato correttamente eseguito 
    COMPLETATO = 'COMPLETATO',        // eseguiti tutti i carichi correttamente -> start e finish valorizzati
}

// Order model schema
export class Order extends Model {
  public id!: number;
  public state!: OrderState;
  public start!: Date | null;
  public finish!: Date | null;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.ENUM({values: Object.keys(OrderState)}),
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finish: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
  }
);
  
  // restituisce la riga di ordine corrispondente all'id fornito
  export async function getOrder(id: number) {
    const order = await Order.findOne({
      where: { id: id },
    });
    return (order)? order.dataValues: undefined;
  }

  // creazione di un nuovo ordine
  export async function createOrder(){
    const retval = await Order.create({state: OrderState.CREATO});
    return retval;
  }

  // funzione che elimina la riga dell'ordine "id", a cascata, saranno rimosse le righe di Load con "orderid" pari a "id"
  export async function destroyOrder(id: number){
    const count = await Order.destroy({ where: { id: id } }); 
    return count;
  }
  
  // metodo che serve ad asseganre il valore "state" alla colonna "state" dell'ordine "id"
  export async function setState(id: number, state: OrderState) {
    const order = await Order.update(
      {
        state: state,
      },
      {
        where: { id: id },
      }
    );
    return order;
  }

  /**
   * 
   * @param id 
   * 
   * Aggiorna lo stato dell'ordine indicato da "id" ad IN ESECUZIONE, e assegna il timestamp corrente a "start"
   */
  export async function takeOrder(id: number) {
    const order = await Order.update(
      {
        state: OrderState.IN_ESECUZIONE,
        start: sequelize.fn('NOW')
      },
      {
        where: { id: id },
      }
    );
    return order;
  }

  /**
   * 
   * @param id 
   * 
   * Aggiorna lo stato dell'ordine indicato da "id" a COMPLETATO, e assegna il timestamp corrente a "finish"
   */
  export async function finishOrder(id: number) {
    const order = await Order.update(
      {
        state: OrderState.COMPLETATO,
        finish: sequelize.fn('NOW')
      },
      {
        where: { id: id },
      }
    );
    return order;
  }