import { query as q } from 'faunadb';

import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subsctiptionId: string,
  customerId: string,
  createAction = false,
) {
  // Buscar o usuário no banco do FaunaDB com o ID {customerId}
  // Salvar os dados da subscription no FaunaDB

  const userRef = await fauna.query(
    q.Select(
      "ref", // Busca a referencia do usuário em que o id é igual ao customerId
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  // Pega o ID da subscription
  const subscription = await stripe.subscriptions.retrieve(subsctiptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
    // Adiciona no banco de dados
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subsctiptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}