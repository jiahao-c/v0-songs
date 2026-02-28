SELECT 
  '总歌曲数' AS metric, COUNT(*)::text AS value FROM songs
UNION ALL
SELECT 
  '总歌手数', COUNT(DISTINCT artist)::text FROM songs
UNION ALL
SELECT 
  artist, COUNT(*)::text FROM songs GROUP BY artist ORDER BY COUNT(*) DESC;
