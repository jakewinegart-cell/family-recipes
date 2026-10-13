/* Catholic Saint of the Day — bundled data + liturgical calendar engine (no runtime API).
 * FIXED: all 366 month-day keys of the General Roman Calendar with U.S. proper calendar changes
 * (null = no fixed celebration that day). Ranks: S Solemnity, F Feast, M Memorial, O Optional Memorial.
 * Cross-checked against Wikipedia "General Roman Calendar" (Oct 2026), incl. 2025 St. Teresa of Calcutta
 * and 2026 St. John Henry Newman. U.S. differences: Jan 4, 5, 6, 22, 23; Mar 3; May 10, 15; Jul 1, 4, 5, 14, 18;
 * Sep 9 (Memorial); Oct 6, 19, 20; Nov 13, 18, 23; Dec 9, 12 (Feast).
 */
(function () {
  const FIXED = {
"01-01": [
"Mary, the Holy Mother of God",
"S",
"The Octave Day of Christmas honors Mary as Theotokos, Mother of God."
],
"01-02": [
"Sts. Basil the Great and Gregory Nazianzen, Bishops and Doctors",
"M",
"Cappadocian friends who defended the faith in the Holy Trinity."
],
"01-03": [
"The Most Holy Name of Jesus",
"O",
"\"At the name of Jesus every knee should bend.\""
],
"01-04": [
"St. Elizabeth Ann Seton, Religious",
"M",
"First native-born U.S. saint; founded the Sisters of Charity and Catholic schools."
],
"01-05": [
"St. John Neumann, Bishop",
"M",
"Bishop of Philadelphia who built the parochial school system."
],
"01-06": [
"St. André Bessette, Religious",
"O",
"Humble Holy Cross brother, doorkeeper and healer of Montreal."
],
"01-07": [
"St. Raymond of Penyafort, Priest",
"O",
"Dominican canon lawyer and confessor."
],
"01-08": null,
"01-09": null,
"01-10": null,
"01-11": null,
"01-12": null,
"01-13": [
"St. Hilary, Bishop and Doctor",
"O",
"Bishop of Poitiers, defender of Christ's divinity."
],
"01-14": null,
"01-15": null,
"01-16": null,
"01-17": [
"St. Anthony, Abbot",
"M",
"Father of monks who sought God in the Egyptian desert."
],
"01-18": null,
"01-19": null,
"01-20": [
"St. Fabian, Pope and Martyr; St. Sebastian, Martyr",
"O",
"Early Roman martyrs."
],
"01-21": [
"St. Agnes, Virgin and Martyr",
"M",
"Young Roman martyr, patroness of purity."
],
"01-22": [
"Day of Prayer for the Legal Protection of Unborn Children",
"",
"A U.S. day of prayer and penance for the gift of human life."
],
"01-23": [
"St. Vincent, Deacon and Martyr; St. Marianne Cope, Virgin",
"O",
"Spanish deacon martyr; Franciscan sister who served the lepers of Molokai."
],
"01-24": [
"St. Francis de Sales, Bishop and Doctor",
"M",
"Gentle bishop of Geneva and patron of writers."
],
"01-25": [
"The Conversion of St. Paul the Apostle",
"F",
"Saul the persecutor becomes Paul the Apostle."
],
"01-26": [
"Sts. Timothy and Titus, Bishops",
"M",
"Companions of St. Paul."
],
"01-27": [
"St. Angela Merici, Virgin",
"O",
"Founder of the Ursulines, devoted to educating girls."
],
"01-28": [
"St. Thomas Aquinas, Priest and Doctor",
"M",
"The Angelic Doctor, author of the Summa Theologiae."
],
"01-29": null,
"01-30": null,
"01-31": [
"St. John Bosco, Priest",
"M",
"Founder of the Salesians, father and teacher of youth."
],
"02-01": null,
"02-02": [
"The Presentation of the Lord",
"F",
"Candlemas: Jesus presented in the Temple, a light to the nations."
],
"02-03": [
"St. Blaise, Bishop and Martyr; St. Ansgar, Bishop",
"O",
"Blessing of throats; apostle of the North."
],
"02-04": null,
"02-05": [
"St. Agatha, Virgin and Martyr",
"M",
"Sicilian virgin martyr."
],
"02-06": [
"St. Paul Miki and Companions, Martyrs",
"M",
"Martyrs of Nagasaki, Japan."
],
"02-07": null,
"02-08": [
"St. Jerome Emiliani; St. Josephine Bakhita, Virgin",
"O",
"Patron of orphans; Sudanese former slave who became a Canossian sister."
],
"02-09": null,
"02-10": [
"St. Scholastica, Virgin",
"M",
"Sister of St. Benedict."
],
"02-11": [
"Our Lady of Lourdes",
"O",
"Mary's appearances to St. Bernadette in 1858."
],
"02-12": null,
"02-13": null,
"02-14": [
"Sts. Cyril, Monk, and Methodius, Bishop",
"M",
"Apostles to the Slavs."
],
"02-15": null,
"02-16": null,
"02-17": [
"The Seven Holy Founders of the Servite Order",
"O",
"Florentine merchants devoted to Our Lady of Sorrows."
],
"02-18": null,
"02-19": null,
"02-20": null,
"02-21": [
"St. Peter Damian, Bishop and Doctor",
"O",
"Reformer of the Church and monastic life."
],
"02-22": [
"The Chair of St. Peter the Apostle",
"F",
"Honors Peter's teaching office as the rock of the Church."
],
"02-23": [
"St. Polycarp, Bishop and Martyr",
"M",
"Bishop of Smyrna, disciple of St. John."
],
"02-24": null,
"02-25": null,
"02-26": null,
"02-27": [
"St. Gregory of Narek, Abbot and Doctor",
"O",
"Armenian monk and mystical poet."
],
"02-28": null,
"02-29": null,
"03-01": null,
"03-02": null,
"03-03": [
"St. Katharine Drexel, Virgin",
"O",
"Philadelphia heiress who served Native and African Americans."
],
"03-04": [
"St. Casimir",
"O",
"Polish-Lithuanian prince known for charity and purity."
],
"03-05": null,
"03-06": null,
"03-07": [
"Sts. Perpetua and Felicity, Martyrs",
"M",
"Young mothers martyred at Carthage."
],
"03-08": [
"St. John of God, Religious",
"O",
"Founder of the Brothers Hospitallers."
],
"03-09": [
"St. Frances of Rome, Religious",
"O",
"Wife, mother, and servant of the poor."
],
"03-10": null,
"03-11": null,
"03-12": null,
"03-13": null,
"03-14": null,
"03-15": null,
"03-16": null,
"03-17": [
"St. Patrick, Bishop",
"O",
"Apostle of Ireland."
],
"03-18": [
"St. Cyril of Jerusalem, Bishop and Doctor",
"O",
"Teacher of catechumens."
],
"03-19": [
"St. Joseph, Spouse of the Blessed Virgin Mary",
"S",
"Guardian of the Redeemer and patron of the universal Church."
],
"03-20": null,
"03-21": null,
"03-22": null,
"03-23": [
"St. Turibius of Mogrovejo, Bishop",
"O",
"Missionary archbishop of Lima."
],
"03-24": null,
"03-25": [
"The Annunciation of the Lord",
"S",
"The angel Gabriel announces the Incarnation to Mary."
],
"03-26": null,
"03-27": null,
"03-28": null,
"03-29": null,
"03-30": null,
"03-31": null,
"04-01": null,
"04-02": [
"St. Francis of Paola, Hermit",
"O",
"Founder of the Minim friars."
],
"04-03": null,
"04-04": [
"St. Isidore, Bishop and Doctor",
"O",
"Scholar-bishop of Seville."
],
"04-05": [
"St. Vincent Ferrer, Priest",
"O",
"Dominican preacher of repentance."
],
"04-06": null,
"04-07": [
"St. John Baptist de la Salle, Priest",
"M",
"Patron of teachers."
],
"04-08": null,
"04-09": null,
"04-10": null,
"04-11": [
"St. Stanislaus, Bishop and Martyr",
"M",
"Bishop of Kraków."
],
"04-12": null,
"04-13": [
"St. Martin I, Pope and Martyr",
"O",
"Pope who died in exile defending the faith."
],
"04-14": null,
"04-15": null,
"04-16": null,
"04-17": null,
"04-18": null,
"04-19": null,
"04-20": null,
"04-21": [
"St. Anselm, Bishop and Doctor",
"O",
"\"Faith seeking understanding.\""
],
"04-22": null,
"04-23": [
"St. George, Martyr; St. Adalbert, Bishop and Martyr",
"O",
"Soldier martyr; apostle of Bohemia and Prussia."
],
"04-24": [
"St. Fidelis of Sigmaringen, Priest and Martyr",
"O",
"Capuchin martyr."
],
"04-25": [
"St. Mark, Evangelist",
"F",
"Author of the second Gospel."
],
"04-26": null,
"04-27": null,
"04-28": [
"St. Peter Chanel, Priest and Martyr; St. Louis Grignion de Montfort, Priest",
"O",
"Martyr of Oceania; apostle of devotion to Mary."
],
"04-29": [
"St. Catherine of Siena, Virgin and Doctor",
"M",
"Mystic and peacemaker who counseled popes."
],
"04-30": [
"St. Pius V, Pope",
"O",
"Reforming pope after the Council of Trent."
],
"05-01": [
"St. Joseph the Worker",
"O",
"Patron of workers."
],
"05-02": [
"St. Athanasius, Bishop and Doctor",
"M",
"Champion of Nicene faith."
],
"05-03": [
"Sts. Philip and James, Apostles",
"F",
"Two of the Twelve."
],
"05-04": null,
"05-05": null,
"05-06": null,
"05-07": null,
"05-08": null,
"05-09": null,
"05-10": [
"St. Damien de Veuster, Priest; St. John of Avila, Priest and Doctor",
"O",
"Apostle of the lepers of Molokai; Spanish preacher."
],
"05-11": null,
"05-12": [
"Sts. Nereus and Achilleus, Martyrs; St. Pancras, Martyr",
"O",
"Early Roman martyrs."
],
"05-13": [
"Our Lady of Fatima",
"O",
"Mary's appearances in Portugal in 1917."
],
"05-14": [
"St. Matthias, Apostle",
"F",
"Chosen to replace Judas among the Twelve."
],
"05-15": [
"St. Isidore the Farmer",
"O",
"Patron of farmers and rural life."
],
"05-16": null,
"05-17": null,
"05-18": [
"St. John I, Pope and Martyr",
"O",
"Pope who died in prison."
],
"05-19": null,
"05-20": [
"St. Bernardine of Siena, Priest",
"O",
"Franciscan preacher of the Holy Name."
],
"05-21": [
"St. Christopher Magallanes, Priest, and Companions, Martyrs",
"O",
"Martyrs of the Mexican persecution."
],
"05-22": [
"St. Rita of Cascia, Religious",
"O",
"Wife, widow, and Augustinian nun; patron of impossible causes."
],
"05-23": null,
"05-24": null,
"05-25": [
"St. Bede the Venerable, Priest and Doctor; St. Gregory VII, Pope; St. Mary Magdalene de' Pazzi, Virgin",
"O",
"Father of English history; reforming pope; Carmelite mystic."
],
"05-26": [
"St. Philip Neri, Priest",
"M",
"Joyful apostle of Rome."
],
"05-27": [
"St. Augustine of Canterbury, Bishop",
"O",
"Apostle of the English."
],
"05-28": null,
"05-29": [
"St. Paul VI, Pope",
"O",
"Pope who completed the Second Vatican Council."
],
"05-30": null,
"05-31": [
"The Visitation of the Blessed Virgin Mary",
"F",
"Mary visits Elizabeth and sings the Magnificat."
],
"06-01": [
"St. Justin, Martyr",
"M",
"Philosopher and apologist."
],
"06-02": [
"Sts. Marcellinus and Peter, Martyrs",
"O",
"Roman martyrs."
],
"06-03": [
"Sts. Charles Lwanga and Companions, Martyrs",
"M",
"Martyrs of Uganda."
],
"06-04": null,
"06-05": [
"St. Boniface, Bishop and Martyr",
"M",
"Apostle of Germany."
],
"06-06": [
"St. Norbert, Bishop",
"O",
"Founder of the Premonstratensians."
],
"06-07": null,
"06-08": null,
"06-09": [
"St. Ephrem, Deacon and Doctor",
"O",
"Harp of the Holy Spirit, Syrian hymn-writer."
],
"06-10": null,
"06-11": [
"St. Barnabas, Apostle",
"M",
"Companion of Paul, \"son of encouragement.\""
],
"06-12": null,
"06-13": [
"St. Anthony of Padua, Priest and Doctor",
"M",
"Franciscan preacher, finder of lost things."
],
"06-14": null,
"06-15": null,
"06-16": null,
"06-17": null,
"06-18": null,
"06-19": [
"St. Romuald, Abbot",
"O",
"Founder of the Camaldolese."
],
"06-20": null,
"06-21": [
"St. Aloysius Gonzaga, Religious",
"M",
"Young Jesuit who died serving plague victims."
],
"06-22": [
"St. Paulinus of Nola, Bishop; Sts. John Fisher, Bishop, and Thomas More, Martyrs",
"O",
"Generous bishop; English martyrs for conscience."
],
"06-23": null,
"06-24": [
"The Nativity of St. John the Baptist",
"S",
"Birth of the forerunner of the Lord."
],
"06-25": null,
"06-26": null,
"06-27": [
"St. Cyril of Alexandria, Bishop and Doctor",
"O",
"Defender of Mary as Mother of God."
],
"06-28": [
"St. Irenaeus, Bishop, Martyr and Doctor",
"M",
"Bishop of Lyons, foe of Gnosticism."
],
"06-29": [
"Sts. Peter and Paul, Apostles",
"S",
"Pillars of the Church in Rome."
],
"06-30": [
"The First Martyrs of the Holy Roman Church",
"O",
"Christians martyred under Nero."
],
"07-01": [
"St. Junípero Serra, Priest",
"O",
"Franciscan missionary of California."
],
"07-02": null,
"07-03": [
"St. Thomas, Apostle",
"F",
"\"My Lord and my God!\""
],
"07-04": [
"Independence Day",
"O",
"U.S. optional Mass for the nation."
],
"07-05": [
"St. Anthony Zaccaria, Priest; St. Elizabeth of Portugal",
"O",
"Founder of the Barnabites; peacemaking queen."
],
"07-06": [
"St. Maria Goretti, Virgin and Martyr",
"O",
"Young martyr who forgave her attacker."
],
"07-07": null,
"07-08": null,
"07-09": [
"St. Augustine Zhao Rong, Priest, and Companions, Martyrs",
"O",
"Martyrs of China."
],
"07-10": null,
"07-11": [
"St. Benedict, Abbot",
"M",
"Father of Western monasticism."
],
"07-12": null,
"07-13": [
"St. Henry",
"O",
"Holy Roman Emperor."
],
"07-14": [
"St. Kateri Tekakwitha, Virgin",
"M",
"\"Lily of the Mohawks,\" first Native American saint."
],
"07-15": [
"St. Bonaventure, Bishop and Doctor",
"M",
"The Seraphic Doctor."
],
"07-16": [
"Our Lady of Mount Carmel",
"O",
"Patroness of the Carmelites; the brown scapular."
],
"07-17": null,
"07-18": [
"St. Camillus de Lellis, Priest",
"O",
"Founder of the Ministers of the Sick."
],
"07-19": null,
"07-20": [
"St. Apollinaris, Bishop and Martyr",
"O",
"First bishop of Ravenna."
],
"07-21": [
"St. Lawrence of Brindisi, Priest and Doctor",
"O",
"Capuchin preacher and scholar."
],
"07-22": [
"St. Mary Magdalene",
"F",
"\"Apostle to the Apostles,\" first witness of the Resurrection."
],
"07-23": [
"St. Bridget, Religious",
"O",
"Swedish mystic, co-patroness of Europe."
],
"07-24": [
"St. Sharbel Makhluf, Priest",
"O",
"Lebanese Maronite hermit."
],
"07-25": [
"St. James, Apostle",
"F",
"Son of Zebedee, patron of Spain."
],
"07-26": [
"Sts. Joachim and Anne, Parents of the Blessed Virgin Mary",
"M",
"Grandparents of Jesus."
],
"07-27": null,
"07-28": null,
"07-29": [
"Sts. Martha, Mary and Lazarus",
"M",
"Friends of the Lord at Bethany."
],
"07-30": [
"St. Peter Chrysologus, Bishop and Doctor",
"O",
"\"Golden-worded\" bishop of Ravenna."
],
"07-31": [
"St. Ignatius of Loyola, Priest",
"M",
"Founder of the Jesuits."
],
"08-01": [
"St. Alphonsus Liguori, Bishop and Doctor",
"M",
"Patron of confessors and moral theologians."
],
"08-02": [
"St. Eusebius of Vercelli, Bishop; St. Peter Julian Eymard, Priest",
"O",
"Defender of the faith; apostle of the Eucharist."
],
"08-03": null,
"08-04": [
"St. John Vianney, Priest",
"M",
"The Curé of Ars, patron of parish priests."
],
"08-05": [
"The Dedication of the Basilica of St. Mary Major",
"O",
"Rome's great Marian basilica."
],
"08-06": [
"The Transfiguration of the Lord",
"F",
"Christ's glory revealed on the mountain."
],
"08-07": [
"St. Sixtus II, Pope, and Companions, Martyrs; St. Cajetan, Priest",
"O",
"Roman martyrs; founder of the Theatines."
],
"08-08": [
"St. Dominic, Priest",
"M",
"Founder of the Order of Preachers."
],
"08-09": [
"St. Teresa Benedicta of the Cross (Edith Stein), Virgin and Martyr",
"O",
"Philosopher and Carmelite martyred at Auschwitz."
],
"08-10": [
"St. Lawrence, Deacon and Martyr",
"F",
"Roman deacon who called the poor the Church's treasure."
],
"08-11": [
"St. Clare, Virgin",
"M",
"Founder of the Poor Clares."
],
"08-12": [
"St. Jane Frances de Chantal, Religious",
"O",
"Co-founder of the Visitation sisters."
],
"08-13": [
"Sts. Pontian, Pope, and Hippolytus, Priest, Martyrs",
"O",
"Reconciled in exile and martyrdom."
],
"08-14": [
"St. Maximilian Kolbe, Priest and Martyr",
"M",
"Gave his life for another prisoner at Auschwitz."
],
"08-15": [
"The Assumption of the Blessed Virgin Mary",
"S",
"Mary taken body and soul into heavenly glory."
],
"08-16": [
"St. Stephen of Hungary",
"O",
"First king of Hungary."
],
"08-17": null,
"08-18": null,
"08-19": [
"St. John Eudes, Priest",
"O",
"Apostle of the Sacred Hearts."
],
"08-20": [
"St. Bernard, Abbot and Doctor",
"M",
"Cistercian, \"the honey-sweet doctor.\""
],
"08-21": [
"St. Pius X, Pope",
"M",
"Pope of frequent Communion."
],
"08-22": [
"The Queenship of the Blessed Virgin Mary",
"M",
"Mary crowned Queen of Heaven."
],
"08-23": [
"St. Rose of Lima, Virgin",
"O",
"First canonized saint of the Americas."
],
"08-24": [
"St. Bartholomew, Apostle",
"F",
"One of the Twelve, also called Nathanael."
],
"08-25": [
"St. Louis; St. Joseph Calasanz, Priest",
"O",
"King of France; founder of free schools for the poor."
],
"08-26": null,
"08-27": [
"St. Monica",
"M",
"Mother whose prayers won Augustine's conversion."
],
"08-28": [
"St. Augustine, Bishop and Doctor",
"M",
"Bishop of Hippo: \"Our hearts are restless until they rest in you.\""
],
"08-29": [
"The Passion of St. John the Baptist",
"M",
"Martyrdom of the forerunner."
],
"08-30": null,
"08-31": null,
"09-01": null,
"09-02": null,
"09-03": [
"St. Gregory the Great, Pope and Doctor",
"M",
"Pope, reformer, and teacher."
],
"09-04": null,
"09-05": [
"St. Teresa of Calcutta, Virgin",
"O",
"Mother Teresa, missionary of charity to the poorest of the poor."
],
"09-06": null,
"09-07": null,
"09-08": [
"The Nativity of the Blessed Virgin Mary",
"F",
"Birthday of Our Lady."
],
"09-09": [
"St. Peter Claver, Priest",
"M",
"\"Slave of the slaves\" in Cartagena."
],
"09-10": null,
"09-11": null,
"09-12": [
"The Most Holy Name of Mary",
"O",
"Honoring the name of the Mother of God."
],
"09-13": [
"St. John Chrysostom, Bishop and Doctor",
"M",
"\"Golden-mouthed\" preacher of Constantinople."
],
"09-14": [
"The Exaltation of the Holy Cross",
"F",
"\"We adore you, O Christ, and we bless you.\""
],
"09-15": [
"Our Lady of Sorrows",
"M",
"Mary standing beneath the Cross."
],
"09-16": [
"Sts. Cornelius, Pope, and Cyprian, Bishop, Martyrs",
"M",
"Shepherds in a time of persecution."
],
"09-17": [
"St. Robert Bellarmine, Bishop and Doctor; St. Hildegard of Bingen, Virgin and Doctor",
"O",
"Jesuit theologian; Benedictine abbess and visionary."
],
"09-18": null,
"09-19": [
"St. Januarius, Bishop and Martyr",
"O",
"Patron of Naples."
],
"09-20": [
"Sts. Andrew Kim Tae-gŏn, Priest, Paul Chŏng Ha-sang, and Companions, Martyrs",
"M",
"Martyrs of Korea."
],
"09-21": [
"St. Matthew, Apostle and Evangelist",
"F",
"Tax collector who left all to follow Jesus."
],
"09-22": null,
"09-23": [
"St. Pius of Pietrelcina (Padre Pio), Priest",
"M",
"Capuchin confessor and stigmatist."
],
"09-24": null,
"09-25": null,
"09-26": [
"Sts. Cosmas and Damian, Martyrs",
"O",
"Physician brothers who healed without fee."
],
"09-27": [
"St. Vincent de Paul, Priest",
"M",
"Patron of charitable works."
],
"09-28": [
"St. Wenceslaus, Martyr; St. Lawrence Ruiz and Companions, Martyrs",
"O",
"Duke of Bohemia; Filipino martyr in Japan."
],
"09-29": [
"Sts. Michael, Gabriel and Raphael, Archangels",
"F",
"Messengers and defenders of God's people."
],
"09-30": [
"St. Jerome, Priest and Doctor",
"M",
"Translator of the Bible into Latin."
],
"10-01": [
"St. Thérèse of the Child Jesus, Virgin and Doctor",
"M",
"The Little Flower and her \"little way.\""
],
"10-02": [
"The Holy Guardian Angels",
"M",
"\"Angel of God, my guardian dear...\""
],
"10-03": null,
"10-04": [
"St. Francis of Assisi",
"M",
"Poor man of Assisi who loved all creation."
],
"10-05": [
"St. Faustina Kowalska, Virgin",
"O",
"Apostle of Divine Mercy."
],
"10-06": [
"St. Bruno, Priest; Blessed Marie-Rose Durocher, Virgin",
"O",
"Founder of the Carthusians; Canadian teaching sister."
],
"10-07": [
"Our Lady of the Rosary",
"M",
"Honoring Mary through the Rosary."
],
"10-08": null,
"10-09": [
"St. Denis, Bishop, and Companions, Martyrs; St. John Leonardi, Priest; St. John Henry Newman, Priest and Doctor",
"O",
"Patron of France; founder and pharmacist; English convert, scholar, and cardinal."
],
"10-10": null,
"10-11": [
"St. John XXIII, Pope",
"O",
"\"Good Pope John,\" who opened Vatican II."
],
"10-12": null,
"10-13": null,
"10-14": [
"St. Callistus I, Pope and Martyr",
"O",
"Former slave who became pope."
],
"10-15": [
"St. Teresa of Jesus, Virgin and Doctor",
"M",
"Teresa of Ávila, reformer of Carmel."
],
"10-16": [
"St. Hedwig, Religious; St. Margaret Mary Alacoque, Virgin",
"O",
"Duchess of Silesia; apostle of the Sacred Heart."
],
"10-17": [
"St. Ignatius of Antioch, Bishop and Martyr",
"M",
"\"I am the wheat of God.\""
],
"10-18": [
"St. Luke, Evangelist",
"F",
"Physician and author of the Gospel and Acts."
],
"10-19": [
"Sts. John de Brébeuf and Isaac Jogues, Priests, and Companions, Martyrs",
"M",
"The North American Martyrs."
],
"10-20": [
"St. Paul of the Cross, Priest",
"O",
"Founder of the Passionists."
],
"10-21": null,
"10-22": [
"St. John Paul II, Pope",
"O",
"\"Be not afraid!\""
],
"10-23": [
"St. John of Capistrano, Priest",
"O",
"Franciscan preacher and reformer."
],
"10-24": [
"St. Anthony Mary Claret, Bishop",
"O",
"Founder of the Claretians."
],
"10-25": null,
"10-26": null,
"10-27": null,
"10-28": [
"Sts. Simon and Jude, Apostles",
"F",
"Two of the Twelve; Jude is patron of hopeless causes."
],
"10-29": null,
"10-30": null,
"10-31": null,
"11-01": [
"All Saints",
"S",
"The whole company of heaven."
],
"11-02": [
"The Commemoration of All the Faithful Departed (All Souls)",
"",
"We pray for all who have died."
],
"11-03": [
"St. Martin de Porres, Religious",
"O",
"Dominican brother of Lima, servant of the poor."
],
"11-04": [
"St. Charles Borromeo, Bishop",
"M",
"Reforming archbishop of Milan."
],
"11-05": null,
"11-06": null,
"11-07": null,
"11-08": null,
"11-09": [
"The Dedication of the Lateran Basilica",
"F",
"The cathedral of Rome, \"mother of all churches.\""
],
"11-10": [
"St. Leo the Great, Pope and Doctor",
"M",
"Pope who defined Christ's two natures."
],
"11-11": [
"St. Martin of Tours, Bishop",
"M",
"Soldier who shared his cloak with a beggar."
],
"11-12": [
"St. Josaphat, Bishop and Martyr",
"M",
"Martyr for Christian unity."
],
"11-13": [
"St. Frances Xavier Cabrini, Virgin",
"M",
"First U.S. citizen canonized; patron of immigrants."
],
"11-14": null,
"11-15": [
"St. Albert the Great, Bishop and Doctor",
"O",
"Scientist, theologian, teacher of Aquinas."
],
"11-16": [
"St. Margaret of Scotland; St. Gertrude, Virgin",
"O",
"Queen of charity; mystic of the Sacred Heart."
],
"11-17": [
"St. Elizabeth of Hungary, Religious",
"M",
"Princess who served the poor and sick."
],
"11-18": [
"The Dedication of the Basilicas of Sts. Peter and Paul; St. Rose Philippine Duchesne, Virgin",
"O",
"Rome's apostolic basilicas; frontier missionary to Missouri."
],
"11-19": null,
"11-20": null,
"11-21": [
"The Presentation of the Blessed Virgin Mary",
"M",
"Mary offered to God in the Temple."
],
"11-22": [
"St. Cecilia, Virgin and Martyr",
"M",
"Patron of musicians."
],
"11-23": [
"St. Clement I, Pope and Martyr; St. Columban, Abbot; Blessed Miguel Agustín Pro, Priest and Martyr",
"O",
"Early pope; Irish missionary; Mexican Jesuit martyr."
],
"11-24": [
"St. Andrew Dũng-Lạc, Priest, and Companions, Martyrs",
"M",
"Martyrs of Vietnam."
],
"11-25": [
"St. Catherine of Alexandria, Virgin and Martyr",
"O",
"Learned virgin martyr."
],
"11-26": null,
"11-27": null,
"11-28": null,
"11-29": null,
"11-30": [
"St. Andrew, Apostle",
"F",
"First called, brother of Peter."
],
"12-01": null,
"12-02": null,
"12-03": [
"St. Francis Xavier, Priest",
"M",
"Jesuit missionary to India and Japan."
],
"12-04": [
"St. John Damascene, Priest and Doctor",
"O",
"Defender of holy images."
],
"12-05": null,
"12-06": [
"St. Nicholas, Bishop",
"O",
"Generous bishop of Myra."
],
"12-07": [
"St. Ambrose, Bishop and Doctor",
"M",
"Bishop of Milan who baptized Augustine."
],
"12-08": [
"The Immaculate Conception of the Blessed Virgin Mary",
"S",
"Patronal feast of the United States."
],
"12-09": [
"St. Juan Diego Cuauhtlatoatzin",
"O",
"Visionary of Our Lady of Guadalupe."
],
"12-10": [
"Our Lady of Loreto",
"O",
"The Holy House of Nazareth."
],
"12-11": [
"St. Damasus I, Pope",
"O",
"Pope who commissioned St. Jerome's Vulgate."
],
"12-12": [
"Our Lady of Guadalupe",
"F",
"Patroness of the Americas."
],
"12-13": [
"St. Lucy, Virgin and Martyr",
"M",
"Light in the darkness of winter."
],
"12-14": [
"St. John of the Cross, Priest and Doctor",
"M",
"Carmelite mystic of the \"dark night.\""
],
"12-15": null,
"12-16": null,
"12-17": null,
"12-18": null,
"12-19": null,
"12-20": null,
"12-21": [
"St. Peter Canisius, Priest and Doctor",
"O",
"Jesuit catechist of Germany."
],
"12-22": null,
"12-23": [
"St. John of Kanty, Priest",
"O",
"Polish scholar and friend of the poor."
],
"12-24": null,
"12-25": [
"The Nativity of the Lord (Christmas)",
"S",
"\"The Word became flesh and dwelt among us.\""
],
"12-26": [
"St. Stephen, the First Martyr",
"F",
"Deacon and first martyr."
],
"12-27": [
"St. John, Apostle and Evangelist",
"F",
"The beloved disciple."
],
"12-28": [
"The Holy Innocents, Martyrs",
"F",
"Children slain by Herod."
],
"12-29": [
"St. Thomas Becket, Bishop and Martyr",
"O",
"Archbishop of Canterbury martyred in his cathedral."
],
"12-30": null,
"12-31": [
"St. Sylvester I, Pope",
"O",
"Pope at the time of the Council of Nicaea."
]
};
  const RANK = { S: "Solemnity", F: "Feast", M: "Memorial", O: "Optional Memorial", "": "" };
  const LORD_FEASTS = new Set(["02-02", "08-06", "09-14", "11-09"]); // feasts of the Lord that replace Sundays in Ordinary Time
  const DAY = 864e5, WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const D = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
  const add = (d, n) => new Date(d.getTime() + n * DAY);
  const diff = (a, b) => Math.round((a - b) / DAY);
  const dow = d => d.getUTCDay();
  const same = (a, b) => a.getTime() === b.getTime();
  const key = d => String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
  const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const ORDW = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"];

  function easter(y) { // anonymous Gregorian computus
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return D(y, mo, da);
  }
  const advent1 = y => { const x = D(y, 12, 25); return add(x, -(dow(x) || 7) - 21); };
  const epiphany = y => { const j2 = D(y, 1, 2); return add(j2, (7 - dow(j2)) % 7); };          // U.S.: Sunday Jan 2–8
  const baptism = y => { const e = epiphany(y); return e.getUTCDate() >= 7 ? add(e, 1) : add(e, 7); };
  const holyFamily = y => { for (let d = 26; d <= 31; d++) if (dow(D(y, 12, d)) === 0) return D(y, 12, d); return D(y, 12, 30); };

  // Temporal cycle. level: 1 = beats everything (fixed solemnities transfer), 2 = solemnity, 5 = feast of the Lord,
  // 6 = Sunday of Christmas/OT, 9 = privileged weekday (Lent, Dec 17–24, Christmas octave), 13 = ordinary weekday.
  function temporal(t) {
    const y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate(), w = WD[dow(t)], sun = dow(t) === 0;
    const E = easter(y), ash = add(E, -46), palm = add(E, -7), pent = add(E, 49), A1 = advent1(y), CK = add(A1, -7);
    const r = (title, rank, level, season) => ({ title, rank, level, season });
    if (t >= A1 && m === 12 && d < 25) {
      const wk = Math.floor(diff(t, A1) / 7) + 1;
      if (sun) return r(`${ORDW[wk]} Sunday of Advent`, "Sunday", 1, "Advent");
      if (d >= 17) return r(`${w} of Advent (December ${d})`, "Advent Weekday", 9, "Advent");
      return r(`${w} of the ${ord(wk)} Week of Advent`, "Advent Weekday", 13, "Advent");
    }
    if (m === 12 && d >= 25) {
      if (d === 25) return r("The Nativity of the Lord (Christmas)", "Solemnity", 1, "Christmas");
      if (same(t, holyFamily(y))) return r("The Holy Family of Jesus, Mary and Joseph", "Feast", 5, "Christmas");
      return r(`${w} within the Octave of Christmas`, "Christmas Weekday", 9, "Christmas");
    }
    const ep = epiphany(y), bp = baptism(y);
    if (t < bp) {
      if (m === 1 && d === 1) return r("Mary, the Holy Mother of God", "Solemnity", 2, "Christmas");
      if (same(t, ep)) return r("The Epiphany of the Lord", "Solemnity", 1, "Christmas");
      return r(`${w} ${t < ep ? "before" : "after"} Epiphany`, "Christmas Weekday", 13, "Christmas");
    }
    if (same(t, bp)) return r("The Baptism of the Lord", "Feast", 5, "Christmas");
    if (t < ash) {
      const s2 = add(bp, 7 - dow(bp)), wk = t < s2 ? 1 : 2 + Math.floor(diff(t, s2) / 7);
      return sun ? r(`${ord(wk)} Sunday in Ordinary Time`, "Sunday", 6, "Ordinary Time") : r(`${w} of the ${ord(wk)} Week in Ordinary Time`, "Weekday", 13, "Ordinary Time");
    }
    if (t < palm) {
      if (same(t, ash)) return r("Ash Wednesday", "Day of Fasting and Abstinence", 1, "Lent");
      const L1 = add(ash, 4);
      if (t < L1) return r(`${w} after Ash Wednesday`, "Lenten Weekday", 9, "Lent");
      const wk = Math.floor(diff(t, L1) / 7) + 1;
      return sun ? r(`${ORDW[wk]} Sunday of Lent${wk === 4 ? " (Laetare Sunday)" : ""}`, "Sunday", 1, "Lent") : r(`${w} of the ${ord(wk)} Week of Lent`, "Lenten Weekday", 9, "Lent");
    }
    if (t < E) {
      const n = diff(t, palm);
      const T = ["Palm Sunday of the Passion of the Lord", "Monday of Holy Week", "Tuesday of Holy Week", "Wednesday of Holy Week",
        "Holy Thursday", "Good Friday of the Passion of the Lord", "Holy Saturday"][n];
      return r(T, n >= 4 ? "Paschal Triduum" : n === 0 ? "Sunday" : "Holy Week", 1, n >= 4 ? "Paschal Triduum" : "Lent");
    }
    if (t <= pent) {
      const n = diff(t, E), wk = Math.floor(n / 7) + 1;
      if (n === 0) return r("Easter Sunday of the Resurrection of the Lord", "Solemnity", 1, "Easter");
      if (n < 7) return r(`${w} within the Octave of Easter`, "Solemnity", 1, "Easter");
      if (n === 7) return r("Second Sunday of Easter (Sunday of Divine Mercy)", "Sunday", 1, "Easter");
      if (n === 42) return r("The Ascension of the Lord", "Solemnity", 1, "Easter");  // U.S. (most provinces): transferred to the 7th Sunday of Easter
      if (n === 49) return r("Pentecost Sunday", "Solemnity", 1, "Easter");
      return sun ? r(`${ORDW[wk]} Sunday of Easter`, "Sunday", 1, "Easter") : r(`${w} of the ${ord(wk)} Week of Easter`, "Easter Weekday", 13, "Easter");
    }
    // Ordinary Time after Pentecost (counted back from Christ the King = 34th Sunday)
    const n = diff(t, pent);
    if (n === 7) return r("The Most Holy Trinity", "Solemnity", 2, "Ordinary Time");
    if (n === 14) return r("The Most Holy Body and Blood of Christ (Corpus Christi)", "Solemnity", 2, "Ordinary Time"); // U.S.: Sunday
    if (n === 19) return r("The Most Sacred Heart of Jesus", "Solemnity", 2, "Ordinary Time");
    if (same(t, CK)) return r("Our Lord Jesus Christ, King of the Universe", "Solemnity", 2, "Ordinary Time");
    const wk = 34 - diff(CK, add(t, -dow(t))) / 7;
    return sun ? r(`${ord(wk)} Sunday in Ordinary Time`, "Sunday", 6, "Ordinary Time") : r(`${w} of the ${ord(wk)} Week in Ordinary Time`, "Weekday", 13, "Ordinary Time");
  }

  // Fixed celebrations for a date, including the usual transfers of impeded solemnities and U.S. Jan 22 rule.
  function fixedFor(t) {
    const y = t.getUTCFullYear(), E = easter(y), palm = add(E, -7), out = [];
    const k = key(t), f = FIXED[k];
    const tr = (mmdd, target) => { if (same(t, target)) out.push({ ...entry(mmdd), transferred: true }); };
    const entry = mmdd => { const v = FIXED[mmdd]; return { name: v[0], code: v[1], desc: v[2], key: mmdd }; };
    const lvl = d => temporal(d).level;
    // St. Joseph (Mar 19)
    const j = D(y, 3, 19);
    if (j >= palm && j < add(E, 8)) tr("03-19", add(palm, -1)); else if (lvl(j) === 1) tr("03-19", add(j, 1));
    // Annunciation (Mar 25)
    const a = D(y, 3, 25);
    if (a >= palm && a < add(E, 8)) tr("03-25", add(E, 8)); else if (lvl(a) === 1) tr("03-25", add(a, 1));
    // Immaculate Conception (Dec 8) on an Advent Sunday -> Monday
    const ic = D(y, 12, 8); if (dow(ic) === 0) tr("12-08", add(ic, 1));
    // U.S. Day of Prayer for the unborn: Jan 22, or Jan 23 when Jan 22 is a Sunday
    const j22 = D(y, 1, 22); if (dow(j22) === 0) tr("01-22", add(j22, 1));
    if (f) {
      const e = entry(k), moved = (k === "03-19" || k === "03-25") && (lvl(t) === 1 || (t >= palm && t < add(E, 8)));
      const icMoved = k === "12-08" && dow(t) === 0, j22Moved = k === "01-22" && dow(t) === 0;
      if (!moved && !icMoved && !j22Moved) out.unshift(e);
    }
    const ord2 = { S: 0, "": 1, F: 2, M: 3, O: 4 };
    return out.sort((a, b) => (a.key === "01-22") - (b.key === "01-22") || ord2[a.code] - ord2[b.code]);
  }

  // Moveable memorials tied to Pentecost
  function moveableMemorial(t) {
    const pent = add(easter(t.getUTCFullYear()), 49);
    if (same(t, add(pent, 1))) return { name: "The Blessed Virgin Mary, Mother of the Church", code: "M", desc: "Mary, given to the disciples as their mother at the Cross." };
    if (same(t, add(pent, 20))) return { name: "The Immaculate Heart of the Blessed Virgin Mary", code: "M", desc: "Mary, who kept all these things in her heart." };
    return null;
  }

  const TDESC = [
    [/^The Nativity of the Lord/, "\u201cThe Word became flesh and dwelt among us.\u201d"],
    [/^The Holy Family/, "Jesus, Mary and Joseph, model of every Christian family."],
    [/^Mary, the Holy Mother of God/, "The Octave Day of Christmas honors Mary as Mother of God."],
    [/^The Epiphany/, "Christ revealed to the nations, as the Magi bring their gifts."],
    [/^The Baptism of the Lord/, "\u201cThis is my beloved Son, with whom I am well pleased.\u201d"],
    [/^Ash Wednesday/, "\u201cRemember that you are dust, and to dust you shall return.\u201d Lent begins."],
    [/^Palm Sunday/, "Jesus enters Jerusalem; Holy Week begins."],
    [/^Holy Thursday/, "The Lord\u2019s Supper: the gift of the Eucharist and the priesthood."],
    [/^Good Friday/, "The Passion and death of the Lord. A day of fasting and abstinence."],
    [/^Holy Saturday/, "The Church waits at the tomb for the Easter Vigil."],
    [/^Easter Sunday/, "Christ is risen! Alleluia!"],
    [/within the Octave of Easter/, "Each day of the Easter Octave is celebrated as a solemnity."],
    [/Divine Mercy/, "The Octave Day of Easter: \u201cJesus, I trust in you.\u201d"],
    [/^The Ascension/, "Christ ascends to the Father and promises the Spirit."],
    [/^Pentecost/, "The Holy Spirit descends on the Apostles: the birthday of the Church."],
    [/^The Most Holy Trinity/, "One God in three Persons: Father, Son and Holy Spirit."],
    [/Corpus Christi/, "The real presence of Christ in the Eucharist."],
    [/Sacred Heart/, "The love of Christ\u2019s heart, pierced for us."],
    [/King of the Universe/, "The last Sunday of the Church year: Christ reigns."],
    [/Sunday of Advent/, "Preparing to welcome Christ at Christmas and at his return."],
    [/Sunday of Lent/, "Forty days of prayer, fasting and almsgiving."],
    [/Sunday of Easter/, "The fifty days of Easter joy."],
    [/Sunday in Ordinary Time/, "The Lord\u2019s Day."],
  ];
  // Main: {title, rank, desc, day, season, commemoration}
  function saintOfDay(y, m, d) {
    const t = D(y, m, d), tmp = temporal(t), fx = fixedFor(t), mv = moveableMemorial(t);
    let cel = mv && !(fx[0] && fx[0].code === "S") ? mv : fx[0] || null;
    const extra = fx.slice(cel === fx[0] ? 1 : 0).map(x => x.name);
    const res = { day: tmp.title, season: tmp.season, title: tmp.title, rank: tmp.rank, desc: "", commemoration: false, also: extra };
    if (m === 11 && dow(t) === 4 && d >= 22 && d <= 28) res.also.push("Thanksgiving Day (U.S.)");
    const td = TDESC.find(([re]) => re.test(tmp.title)); if (td) res.desc = td[1];
    if (!cel) return res;
    const code = cel.code, isLordFeast = LORD_FEASTS.has(cel.key || "");
    const level = code === "S" || code === "" ? (cel.key === "01-22" ? 13 : 3) : code === "F" ? (isLordFeast ? 5 : 7) : code === "M" ? 10 : 12;
    if (cel.key === "01-22") { // day of prayer: shown alongside the weekday
      Object.assign(res, { title: cel.name, rank: "Day of Prayer (U.S.)", desc: cel.desc }); return res;
    }
    const tl = tmp.level;
    const wins = tl === 1 ? false : tl === 2 ? level < 2 : tl === 5 ? level < 5 || (level === 3) : tl === 6 ? level <= 5 : tl === 9 ? level <= 7 : true;
    if (wins) {
      Object.assign(res, { title: cel.name, rank: cel.key === "11-02" ? "Commemoration" : RANK[code] + (cel.transferred ? " (transferred)" : ""), desc: cel.desc });
    } else if (tl === 9 && level >= 10) {
      res.desc = `Optional commemoration of ${cel.name}.`; res.commemoration = true;
    }
    return res;
  }

  // Date parts in America/Denver
  function denverParts(now = new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Denver", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now).map(x => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day };
  }
  window.Saints = { FIXED, saintOfDay, denverParts, easter, temporal };
})();
