const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Document = require('./models/Document');
const Law = require('./models/Law');

// Sample laws data for Uzbekistan
const sampleLaws = [
  {
    title: "Гражданский кодекс Республики Узбекистан - Статья 1",
    category: "civil",
    articleNumber: "ГК-1",
    content: "Гражданское законодательство основывается на признании равенства участников регулируемых им отношений, неприкосновенности собственности, свободы договора, недопустимости произвольного вмешательства кого-либо в частные дела, необходимости беспрепятственного осуществления гражданских прав, обеспечения восстановления нарушенных прав, их судебной защиты.",
    summary: "Основные принципы гражданского законодательства Республики Узбекистан",
    keywords: ["гражданское право", "равенство", "собственность", "договор", "права"],
    language: "russian",
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Трудовой кодекс - Заключение трудового договора",
    category: "labor", 
    articleNumber: "ТК-77",
    content: "Трудовой договор заключается в письменной форме, составляется в двух экземплярах, каждый из которых подписывается сторонами. Один экземпляр трудового договора передается работнику, другой хранится у работодателя. Получение работником экземпляра трудового договора должно подтверждаться подписью работника на экземпляре договора, хранящемся у работодателя.",
    summary: "Процедура заключения трудового договора в Узбекистане",
    keywords: ["трудовой договор", "работодатель", "работник", "письменная форма", "подпись"],
    language: "russian",
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Закон о государственной регистрации юридических лиц",
    category: "commercial",
    articleNumber: "ЗРЮ-15",
    content: "Государственная регистрация юридических лиц осуществляется в порядке, установленном законодательством, путем внесения в единый государственный реестр юридических лиц сведений о создании, реорганизации и ликвидации юридических лиц, а также иных сведений о юридических лицах в соответствии с настоящим Законом.",
    summary: "Процедура государственной регистрации юридических лиц в Узбекистане",
    keywords: ["регистрация", "юридические лица", "реестр", "создание", "ликвидация"],
    language: "russian", 
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Налоговый кодекс - Налогообложение малого бизнеса",
    category: "tax",
    articleNumber: "НК-156",
    content: "Субъекты малого предпринимательства имеют право применять упрощенную систему налогообложения. При применении упрощенной системы налогообложения субъекты малого предпринимательства освобождаются от уплаты налога на прибыль, налога на добавленную стоимость (за исключением НДС, уплачиваемого при ввозе товаров на территорию Республики Узбекистан), подоходного налога с физических лиц.",
    summary: "Льготное налогообложение для субъектов малого предпринимательства",
    keywords: ["налоги", "малый бизнес", "упрощенная система", "льготы", "предпринимательство"],
    language: "russian",
    country: "Uzbekistan", 
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Закон об интеллектуальной собственности",
    category: "commercial",
    articleNumber: "ИС-25",
    content: "Интеллектуальная собственность охраняется законом. Автору результата интеллектуальной деятельности принадлежит исключительное право на использование такого результата в любой форме и любыми способами. Исключительное право на результат интеллектуальной деятельности может быть передано автором другому лицу по договору.",
    summary: "Основы защиты интеллектуальной собственности в Узбекистане", 
    keywords: ["интеллектуальная собственность", "авторские права", "патенты", "лицензии", "передача прав"],
    language: "russian",
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Административный кодекс - Штрафы за нарушения",
    category: "administrative",
    articleNumber: "АК-45",
    content: "За нарушение правил ведения предпринимательской деятельности применяются административные штрафы в размере от одного до пяти базовых расчетных величин для физических лиц и от пяти до десяти базовых расчетных величин для юридических лиц.",
    summary: "Административная ответственность за нарушения в предпринимательской деятельности",
    keywords: ["административные штрафы", "нарушения", "предпринимательская деятельность", "ответственность"],
    language: "russian",
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  },
  {
    title: "Закон о защите персональных данных",
    category: "civil",
    articleNumber: "ЗПД-12",
    content: "Обработка персональных данных должна осуществляться с соблюдением принципов законности, справедливости, соразмерности, достоверности и добросовестности. Согласие субъекта персональных данных на обработку его персональных данных должно быть получено в письменной форме.",
    summary: "Правила обработки и защиты персональных данных в Узбекистане",
    keywords: ["персональные данные", "обработка данных", "согласие", "конфиденциальность", "защита"],
    language: "russian",
    country: "Uzbekistan",
    effectiveDate: new Date('2023-01-01'),
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminExists = await User.findOne({ email: 'admin@safesign.uz' });
    
    if (!adminExists) {
      const adminUser = new User({
        name: 'SafeSign Admin',
        email: 'admin@safesign.uz',
        password: 'admin123456',
        role: 'admin',
        subscriptionPlan: 'enterprise',
        monthlyLimit: 1000,
        isEmailVerified: true,
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample test user
    console.log('👤 Creating test user...');
    const testUserExists = await User.findOne({ email: 'test@safesign.uz' });
    
    if (!testUserExists) {
      const testUser = new User({
        name: 'Test User',
        email: 'test@safesign.uz', 
        password: 'test123456',
        role: 'user',
        subscriptionPlan: 'free',
        monthlyLimit: 3,
        isEmailVerified: true,
        isActive: true
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    // Populate laws database
    console.log('⚖️  Adding sample laws to database...');
    const existingLaws = await Law.countDocuments();
    
    if (existingLaws === 0) {
      await Law.insertMany(sampleLaws);
      console.log(`✅ Added ${sampleLaws.length} sample laws successfully`);
    } else {
      console.log(`ℹ️  Laws already exist in database (${existingLaws} laws found)`);
    }

    // Create text indexes for search
    console.log('🔍 Creating search indexes...');
    try {
      await Law.collection.createIndex({
        title: 'text',
        content: 'text', 
        keywords: 'text',
        summary: 'text'
      });
      console.log('✅ Search indexes created successfully');
    } catch (error) {
      console.log('ℹ️  Search indexes may already exist');
    }

    console.log('📊 Database seeding completed successfully!');
    console.log('🎯 You can now test the application with these accounts:');
    console.log('   Admin: admin@safesign.uz / admin123456');  
    console.log('   Test:  test@safesign.uz / test123456');
    console.log(`📚 Database contains ${sampleLaws.length} legal documents`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Check if this script is being run directly 
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleLaws };
