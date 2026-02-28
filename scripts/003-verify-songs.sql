SELECT '总歌曲数' AS metric, COUNT(*)::text AS value FROM songs;

SELECT '总歌手数' AS metric, COUNT(DISTINCT artist)::text AS value FROM songs;

SELECT artist, COUNT(*) AS song_count FROM songs GROUP BY artist ORDER BY song_count DESC;
