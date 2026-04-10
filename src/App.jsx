import { useMemo, useState } from 'react'
import { Button, Card, Col, ConfigProvider, Modal, Progress, Row, Space, Typography } from 'antd'
import './App.css'

const { Title, Paragraph, Text } = Typography

const questions = [
  {
    "text": "暗恋对象发了一个没有文字的表情包，你会：",
    "options": [
      { "t": "翻遍全网表情包含义，觉得他在隔空示爱。", "v": "D" },
      { "t": "回一个更可爱的表情，期待开启 5 小时长谈。", "v": "D" },
      { "t": "回个问号，或者干脆不理，觉得他在发疯。", "v": "R" },
      { "t": "直接关掉对话框，对方只是手滑，别自作多情。", "v": "R" }
    ]
  },
  {
    "text": "对方说“最近很忙”，你的第一反应是：",
    "options": [
      { "t": "他一定是在秘密给我准备惊喜，好感动！", "v": "D" },
      { "t": "他为了我们的未来太拼了，我要更体贴才行。", "v": "D" },
      { "t": "他在委婉地劝退我，这就是分手的信号。", "v": "R" },
      { "t": "忙就忙呗，刚好我也没空理这尊大佛。", "v": "R" }
    ]
  },
  {
    "text": "发现对方跟异性聊得很欢，你会：",
    "options": [
      { "t": "在深夜流泪检讨：是不是我最近不够温柔？", "v": "L" },
      { "t": "买份礼物送过去，试图用爱感化对方回归。", "v": "L" },
      { "t": "发朋友圈指桑骂槐，然后等着对方来哄我。", "v": "P" },
      { "t": "直接人间蒸发，这种垃圾不配出现在我的好友位。", "v": "P" }
    ]
  },
  {
    "text": "吵架后对方冷战一周，你会：",
    "options": [
      { "t": "每天换着花样写小作文道歉，求对方回个字。", "v": "L" },
      { "t": "发动共同好友去打探消息，看对方消气没。", "v": "L" },
      { "t": "忍着不联系，但每隔五分钟刷一次对方动态。", "v": "P" },
      { "t": "你不说话我就当你死了，骨灰盒都帮你选好了。", "v": "P" }
    ]
  },
  {
    "text": "一个长相还不错的人主动向你搭讪，你会：",
    "options": [
      { "t": "瞬间连我们孩子的名字和学区房都想好了。", "v": "S" },
      { "t": "受宠若惊，恨不得把家底都交代给对方。", "v": "S" },
      { "t": "怀疑对方是杀猪盘，或者是想骗我下载反诈 App。", "v": "A" },
      { "t": "尴尬癌发作，只想原地消失，别跟我说话。", "v": "A" }
    ]
  },
  {
    "text": "暧昧对象突然想要视频通话，你会：",
    "options": [
      { "t": "原地化个全妆并找好最显瘦的角度接听。", "v": "S" },
      { "t": "秒接，哪怕正在拉稀也要展示最美的微笑。", "v": "S" },
      { "t": "直接挂断，回复：手机摄像头坏了，下次一定。", "v": "A" },
      { "t": "假装没看见，等半小时后再回：刚才在洗澡。", "v": "A" }
    ]
  },
  {
    "text": "关于“前任”，你的态度通常是：",
    "options": [
      { "t": "定期视奸对方动态，脑补他其实还深爱着我。", "v": "M" },
      { "t": "深夜循环伤感情歌，觉得每句歌词都是我的命。", "v": "M" },
      { "t": "没啥感觉，就像看一张过期的超市发票。", "v": "F" },
      { "t": "前任？那是谁？我的人生没有这个回收站。", "v": "F" }
    ]
  },
  {
    "text": "看到别人在街头浪漫求婚，你会：",
    "options": [
      { "t": "感动得稀里哗啦，幻想自己也是女/男主角。", "v": "M" },
      { "t": "立刻拍照发给喜欢的人，暗示对方也学学。", "v": "M" },
      { "t": "面无表情走过去，觉得这群人演技真尴尬。", "v": "F" },
      { "t": "只想报警，这大场面严重阻碍了交通。", "v": "F" }
    ]
  },
  {
    "text": "你觉得真爱在生活中的占比应该是：",
    "options": [
      { "t": "它是我的灵魂支柱，没有爱我就是行尸走肉。", "v": "M" },
      { "t": "每天至少花 8 小时思考怎么爱和被爱。", "v": "M" },
      { "t": "生活的调味品，偶尔加一点，不加也饿不死。", "v": "F" },
      { "t": "纯属浪费时间，不如多刷两道算法题。", "v": "F" }
    ]
  },
  {
    "text": "如果一段感情彻底结束了，你会：",
    "options": [
      { "t": "绝食三日，把所有社交平台头像换成纯黑。", "v": "M" },
      { "t": "反复拉黑又删除，持续三个月的情绪拉锯战。", "v": "M" },
      { "t": "删个好友就完事了，下一位更乖。", "v": "F" },
      { "t": "完全没波动，甚至想下楼吃顿火锅庆祝单身。", "v": "F" }
    ]
  }
]

const resultsMap = {
  "DSLM": {
    "name": "纯情水泥匠",
    "desc": "恋爱脑中的重工业患者。你用泪水和自尊砌成大厦，然后自己住进地下室。对方回个“哦”，你连墓地都选在一起了。建议把脑子里的水导出来，能灌溉整片撒哈拉。",
    "stats": { "delusion": 98, "isolation": 5 }
  },
  "DSLP": {
    "name": "软骨头杠精",
    "desc": "嘴上说着最狠的话，膝盖弯得比谁都快。对方一个电话，你就能原地表演一个“光速打脸”。你的自尊心是拼多多批发的吗？一砍就碎，一拼就回。",
    "stats": { "delusion": 85, "isolation": 15 }
  },
  "DSAM": {
    "name": "赛博望夫石",
    "desc": "网上骚话连篇，现实怂如鹌鹑。你在屏幕后演完了海王的一生，现实里连异性的眼神都接不住。你的恋爱经验全靠手机屏幕的磨损程度支撑。",
    "stats": { "delusion": 90, "isolation": 70 }
  },
  "DSAF": {
    "name": "梦境拾荒者",
    "desc": "现实里没人理，梦里和纸片人爱得死去活来。你的恋爱全靠脑补，建议去写科幻小说。你在等顺丰送对象吗？还是等国家统一分配？",
    "stats": { "delusion": 95, "isolation": 90 }
  },
  "DRLM": {
    "name": "壁虎系舔狗",
    "desc": "被伤透了也能断尾求生，然后找下一个人继续贴上去。你的自愈能力强到让人感到一丝心疼和恶心。你的心是橡胶做的吗？怎么踩都能弹回来？",
    "stats": { "delusion": 40, "isolation": 10 }
  },
  "DRLP": {
    "name": "高端回收站",
    "desc": "清醒地看着对方渣你，还要努力分析对方“其实也有苦衷”。你是情感界的和平大使，专门回收垃圾。你的善良，在对方眼里只是好欺负的入场券。",
    "stats": { "delusion": 30, "isolation": 20 }
  },
  "DRAM": {
    "name": "间歇性自恋",
    "desc": "觉得全世界都在暗恋你，其实大家只是在看路。你这种迷之自信建议分给那些社恐一点。你这不叫追求者众，你这叫由于过度自恋产生的幻觉。",
    "stats": { "delusion": 75, "isolation": 40 }
  },
  "DRAF": {
    "name": "纯血单身狗",
    "desc": "幻想着天降真爱，实际上连门都不出。你觉得缘分会像外卖一样精准敲门？别等了，你等来的只有欠费通知和垃圾短信。",
    "stats": { "delusion": 80, "isolation": 95 }
  },
  "RSLM": {
    "name": "现实派奴隶",
    "desc": "明知没结果还要死缠烂打。你不是执着，你是记性不好还没骨气。你在对方的黑名单里反复横跳，还以为那是跳动的音符。",
    "stats": { "delusion": 20, "isolation": 5 }
  },
  "RSLP": {
    "name": "批发表白王",
    "desc": "广撒网，轻尊严。你的爱就像拼多多，量大但质次，主打一个“万一有人瞎了眼呢”。你的情话都是群发的吧？连称呼都懒得改。",
    "stats": { "delusion": 15, "isolation": 10 }
  },
  "RSAM": {
    "name": "短路型海王",
    "desc": "喜欢搞暧昧，一旦对方认真你立马人间蒸发。你这不叫追求自由，你这叫情感残疾。你只想要狩猎的快感，却承担不起负责任的重量。",
    "stats": { "delusion": 25, "isolation": 65 }
  },
  "RSAF": {
    "name": "冷感人形机",
    "desc": "把恋爱当成低效率社交。建议你直接和 AI 过去吧，至少 AI 不会嫌你没心没肺。你的心房不仅关上了，还为了省电把灯都给拆了。",
    "stats": { "delusion": 10, "isolation": 85 }
  },
  "RPLM": {
    "name": "苦情戏路人",
    "desc": "总觉得自己是悲剧主角，其实你只是个没台词的背景板。你的难过在别人看来只是背景音。醒醒吧，这场戏里你连领盒饭的机会都没有。",
    "stats": { "delusion": 20, "isolation": 30 }
  },
  "RPLP": {
    "name": "孤岛老船长",
    "desc": "看透了一切，从此孤独终老。你赢了比赛，输了人生。恭喜你，你的心现在硬得能砸核桃，但这核桃你打算一个人吃一辈子吗？",
    "stats": { "delusion": 10, "isolation": 95 }
  },
  "RPAM": {
    "name": "被害妄想症",
    "desc": "觉得异性靠近你都是为了骗你的钱或色，虽然你两样都没有。你的防备心是给你的 0 元存款当保镖吗？你这不叫严谨，你这叫自作多情。",
    "stats": { "delusion": 50, "isolation": 80 }
  },
  "RPAF": {
    "name": "铁血枯木精",
    "desc": "情感系统已卸载。你这辈子最亲密的关系就是和充电线。建议入职寺庙，连发型都不用改。你对异性的兴趣还不如对明天天气预报的兴趣大。",
    "stats": { "delusion": 5, "isolation": 100 }
  }
}

const legacyMiddleMap = {
  D: {
    LS: 'SL',
    LA: 'SA',
    PS: 'RL',
    PA: 'RA',
  },
  R: {
    LS: 'SL',
    LA: 'SA',
    PS: 'PL',
    PA: 'PA',
  },
}

function App() {
  const [stage, setStage] = useState('home')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [showUnfinished, setShowUnfinished] = useState(false)

  const answeredCount = useMemo(() => answers.filter(Boolean).length, [answers])
  const getAnswerValue = (idx) => answers[idx]?.v ?? null

  const progress = useMemo(
    () => Math.round((answeredCount / questions.length) * 100),
    [answeredCount],
  )

  const dimensions = useMemo(
    () => [
      { left: 'D', right: 'R', label: '幻想/现实' },
      { left: 'L', right: 'P', label: '依恋/体面' },
      { left: 'S', right: 'A', label: '社交/防御' },
      { left: 'M', right: 'F', label: '感性/理性' },
    ],
    [],
  )

  const dimensionStats = useMemo(() => {
    return dimensions.map((dim) => {
      let total = 0
      let leftCount = 0
      let rightCount = 0
      questions.forEach((q, idx) => {
        const belongs = q.options.some((opt) => opt.v === dim.left || opt.v === dim.right)
        if (!belongs) return
        total += 1
        if (getAnswerValue(idx) === dim.left) leftCount += 1
        if (getAnswerValue(idx) === dim.right) rightCount += 1
      })
      return { ...dim, total, leftCount, rightCount }
    })
  }, [answers, dimensions])

  const code = useMemo(
    () =>
      dimensionStats
        .map((dim) => (dim.leftCount >= dim.rightCount ? dim.left : dim.right))
        .join(''),
    [dimensionStats],
  )

  const normalizedCode = useMemo(
    () => code.toUpperCase().replace(/[^DRLPSAMF]/g, ''),
    [code],
  )

  const result = useMemo(() => {
    if (answeredCount < questions.length) return null
    const direct = resultsMap[normalizedCode]
    if (direct) return direct

    // 兼容你当前 resultsMap 使用的旧 key 编码（例如 DSLM / DRAM 这一套）
    const first = normalizedCode[0]
    const middle = normalizedCode.slice(1, 3)
    const last = normalizedCode[3]
    const legacyMiddle = legacyMiddleMap[first]?.[middle]
    const legacyCode = legacyMiddle ? `${first}${legacyMiddle}${last}` : null
    if (legacyCode && resultsMap[legacyCode]) return resultsMap[legacyCode]

    return (
      {
        name: '映射异常',
        desc: `结果码 ${normalizedCode || '(空)'} 未命中映射表，请检查 resultsMap 的 key 编码格式。`,
      }
    )
  }, [answeredCount, normalizedCode])

  const scoreData = useMemo(
    () =>
      dimensionStats.map((dim) => ({
        label: dim.label,
        left: dim.left,
        right: dim.right,
        leftScore: dim.leftCount,
        rightScore: dim.rightCount,
        total: dim.total,
        pct: dim.total > 0 ? Math.round((dim.leftCount / dim.total) * 100) : 0,
      })),
    [dimensionStats],
  )

  const matchPercent = useMemo(() => {
    if (answeredCount < questions.length) return 0
    const valid = dimensionStats.filter((dim) => dim.total > 0)
    if (!valid.length) return 0
    const confidence = valid.reduce(
      (sum, dim) => sum + Math.max(dim.leftCount, dim.rightCount) / dim.total,
      0,
    )
    return Math.round((confidence / valid.length) * 100)
  }, [answeredCount, dimensionStats])

  const selectOption = (value, optionIndex) => {
    const next = [...answers]
    next[current] = { v: value, optionIndex }
    setAnswers(next)
  }

  const toResult = () => {
    if (answeredCount < questions.length) {
      setShowUnfinished(true)
      return
    }
    setStage('result')
  }

  const resetAll = () => {
    setStage('home')
    setCurrent(0)
    setAnswers(Array(questions.length).fill(null))
    setShowUnfinished(false)
  }

  const renderHome = () => (
    <Card className="sbti-card">
      <Space direction="vertical" size={18} style={{ width: '100%' }}>
        <Title level={2} style={{ margin: 0 }}>
        别测了，这就是你的终极单身报告
        </Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          作者：Sunxiaofei
        </Paragraph>
        <Button type="primary" size="large" block onClick={() => setStage('quiz')}>
          开始测试
        </Button>
      </Space>
    </Card>
  )

  const renderQuiz = () => (
    <Card className="sbti-card">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="head-row">
          <Text strong>
            {answeredCount} / {questions.length}
          </Text>
          <Button type="link" onClick={resetAll}>
            返回首页
          </Button>
        </div>
        <Progress percent={progress} showInfo={false} strokeColor="#111" />
        <Title level={4} style={{ margin: 0 }}>
          {current + 1}. {questions[current].text}
        </Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          {questions[current].options.map((opt, optIdx) => (
            <Button
              key={opt.t}
              className={`opt-btn ${answers[current]?.optionIndex === optIdx ? 'active' : ''}`}
              type={answers[current]?.optionIndex === optIdx ? 'primary' : 'default'}
              block
              onClick={() => selectOption(opt.v, optIdx)}
            >
              {opt.t}
            </Button>
          ))}
        </Space>
        <Row gutter={10}>
          <Col span={12}>
            <Button
              block
              disabled={current === 0}
              onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
            >
              上一题
            </Button>
          </Col>
          <Col span={12}>
            {current === questions.length - 1 ? (
              <Button type="primary" block onClick={toResult}>
                提交并查看结果
              </Button>
            ) : (
              <Button
                type="primary"
                block
                onClick={() => setCurrent((prev) => Math.min(questions.length - 1, prev + 1))}
              >
                下一题
              </Button>
            )}
          </Col>
        </Row>
      </Space>
      <Modal
        title="全选完才会放行。"
        open={showUnfinished}
        onOk={() => setShowUnfinished(false)}
        onCancel={() => setShowUnfinished(false)}
        okText="继续作答"
        cancelText="取消"
      >
        <Paragraph style={{ margin: 0 }}>
          世界已经够乱了，起码把题做完整。当前已完成 {answeredCount}/{questions.length}。
        </Paragraph>
      </Modal>
    </Card>
  )

  const renderResult = () => (
    <Card className="sbti-card">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Text type="secondary">你的主类型</Text>
        <Title level={2} style={{ margin: 0 }}>
          {normalizedCode || code}（{result?.name ?? '未知类型'}）
        </Title>
        <Text>匹配度 {matchPercent}%</Text>
        <Paragraph>{result?.desc ?? '系统备注会显示在这里。'}</Paragraph>

        <div>
          <Title level={5}>十五维度评分</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {scoreData.map((row) => (
              <div key={row.label} className="score-row">
                <Text type="secondary">
                  {row.label}（{row.left}:{row.right} = {row.leftScore}:{row.rightScore}）
                </Text>
                <Progress percent={row.pct} showInfo={false} strokeColor="#1f1f1f" />
              </div>
            ))}
          </Space>
        </div>

        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          这份结果主要用于放松和玩梗，请勿作为医疗、求职、择偶或重大决策依据。
        </Paragraph>
        <Row gutter={10}>
          <Col span={12}>
            <Button block onClick={() => setStage('quiz')}>
              返回答题
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={resetAll}>
              重新测试
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  )

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#111111',
          borderRadius: 12,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <div className="page-wrap">
        {stage === 'home' && renderHome()}
        {stage === 'quiz' && renderQuiz()}
        {stage === 'result' && renderResult()}
      </div>
    </ConfigProvider>
  )
}

export default App
