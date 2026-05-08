const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const teacherRoutes = require('./routes/teacher.routes');
const homeRoutes = require('./routes/home.routes');
const { requestLogger } = require('./utils/logger');

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Lớp học số API',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/home', homeRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
