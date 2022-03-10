---
id: add_ui
title: 添加前端页面
sidebar_label: 添加前端页面
---

**用户体验差是限制区块链技术应用的一个重要方面**，实用漂亮的UI可以显著的提升用户满意度。这里我们为开发的抛硬币游戏编写一个简单的前端页面。

这里我们使用的是Parity官方的前端应用模板 [substrate-front-end-template](https://github.com/substrate-developer-hub/substrate-front-end-template)，基于

* React
* Semantic UI
* [polkadot/api](https://github.com/polkadot-js/api)

## 初始化API和状态

根据项目的README文档可以快速启动这一模板应用，默认使用的是本地的节点WebSocket连接，即`ws://127.0.0.1:9944`，配置位于[development.json](https://github.com/substrate-developer-hub/substrate-front-end-template/blob/master/src/config/development.json)。通过模板内置的[useSubstrate](https://github.com/substrate-developer-hub/substrate-front-end-template#usesubstrate-custom-hook)功能函数来创建和Substrate节点交互的辅助组件，如api。

```jsx
const { api } = useSubstrate();
```

新建一个自己的组件`CoinFlipGame.js`，初始化组件所需的state和设置对应state的函数，更多关于`userState`的解释参考 [React官方文档](https://reactjs.org/docs/hooks-state.html)。

```jsx
// The transaction submission status
const [status, setStatus] = useState("");
// The value stored in Payment
const [currentPayment, setCurrentPayment] = useState(0);
// The value stored in Pot
const [potReward, setPotReward] = useState(0);
// The value which will be set to Payment
const [formPayment, setFormPayment] = useState(0);
```

## 状态更新

我们使用[useEffect](https://reactjs.org/docs/hooks-effect.html)当`api.query.mymodule`的值发生变化时，重新设置currentPayment和potReward状态，当需要清理状态时调用相应的unsubscribe函数。

```js
useEffect(() => {
  let paymentUnsubscribe;
  let potUnsubscribe;
  api.query.mymodule.payment(newPayment => {
    // The Payemnt storage value is an Option<Balance>
    // So we have to check whether it is None first
    // There is also unwrapOr
    if (newPayment.isNone) {
      setCurrentPayment('<None>');
    } else {
      setCurrentPayment(newPayment.unwrap().toNumber());
      setStorePaymentDisabled(true);
    }
  }).then(unsub => {
    paymentUnsubscribe = unsub;
  }).catch(console.error);

  api.query.mymodule.pot(reward => {
    setPotReward(reward.toNumber());
  }).then(unsub => {
    potUnsubscribe = unsub;
  }).catch(console.error);

  return () => paymentUnsubscribe && potUnsubscribe &&
    paymentUnsubscribe() && potUnsubscribe();
}, [api.query.mymodule]);
```

## UI组件

显示Payment和Pot的数据组件，如下：

```jsx
<Statistic
  label="Current Payment"
  value={currentPayment}
/>
    
<Statistic
  label="Reward in Pot"
  value={potReward}
/>
```

我们还可以通过输入框设置Payment的初始值，通过Set Payment按钮发送请求到模块的set_payment可调用函数，一旦Payment的值被设置之后，该button的状态就会变成disable。现在，我们可以通过Play按钮玩游戏了，它会发送请求到runtime模块的play函数。这里用到的 [TxButton](https://github.com/substrate-developer-hub/substrate-front-end-template#txbutton-component) 也是模板内置的一个组件，用来帮我们发送query或transaction请求，监控请求的状态。

```jsx
<Form>
  <Form.Field>
    <Input
      type="number"
      id="new_payment"
      label="New Payment"
      onChange={(_, { value }) => setFormPayment(value)}
    />
  </Form.Field>
  <Form.Field>
    <TxButton
      accountPair={accountPair}
      label={'Set Payment'}
      disabled={storePaymentDisabled}
      setStatus={setStatus}
      type='TRANSACTION'
      attrs={{
        params: [formPayment],
        tx: api.tx.mymodule.setPayment
      }}
    />
    <TxButton
      accountPair={accountPair}
      label={'Play Game'}
      setStatus={setStatus}
      type='TRANSACTION'
      attrs={{
        params: [],
        tx: api.tx.mymodule.play
      }}
    />
  </Form.Field>
  <div style={{ overflowWrap: 'break-word' }}>{status}</div>
</Form
```

可调用函数play执行完成后，在Events结果中，可以看到我们定义的`mymodule:PlayResult`事件，及用户的地址和赢得的奖励，测试结果如下图所示。

![coin_flip_play](https://i.imgur.com/GaXEuDy.png)

## 总结

如果你想学习更多前端开发的知识，请参考[Substrate Front-End Tutorial](https://substrate.io/docs/en/tutorials/substrate-front-end/)，还可以通过不同的练习如[substrate-collectables-workshop](https://github.com/substrate-developer-hub/substrate-collectables-workshop)，甚至编写自己的业务runtime，来巩固这些知识并熟练应用。

[Substrate开发者中心](https://substrate.io/)提供了很多学习资料，时常去逛一下，会有不同的收获。