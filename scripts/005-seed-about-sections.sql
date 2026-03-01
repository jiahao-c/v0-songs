INSERT INTO about_sections (section_key, content_markdown) VALUES
(
  'about_intro',
  '大家好，我是王咚咚，一名来自多伦多的独立原创音乐人。

在业余生活中，我热爱作词、作曲与编曲，尤其擅长创作抒情类歌曲。从事音乐创作已经八年，写歌对我来说就像写日记——是记录生活与情感的方式，也是我表达与释放压力的途径。

如果你对我的作品感兴趣，欢迎在各大音乐平台搜索"王咚咚"，可以听到我的原创与翻唱作品。喜欢的话，也请多多关注与支持，谢谢大家！'
),
(
  'about_songlist',
  '欢迎大家点歌！点歌是免费的！

但如果你喜欢我的演唱，我会很感谢您的小费支持！希望我的歌声带给你美好的音乐体验！'
)
ON CONFLICT (section_key)
DO UPDATE SET
  content_markdown = EXCLUDED.content_markdown,
  updated_at = NOW();
