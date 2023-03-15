import { Router } from 'express'
import authMiddleware from '../middleware/authmiddleware.js'
import userMiddleware from '../middleware/user.js'
import Project from '../models/Project.js'
import Attachment from '../models/Attachment.js'
import Message from '../models/Message.js'
import Thread from '../models/Thread.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
const __dirname = dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../files/'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname)
  }
});

const upload = multer({ storage: storage })

const router = Router()

router.get('/', async (req, res) => {
  const projects = await Project.find().lean()

  res.render('index', {
    title: 'Basecamp',
    projects: projects.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  })
})

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    isAbout: true
  })
})

router.get('/my-projects', async (req, res) => {
  const user = req.userId ? req.userId.toString() : null
  const myProjects = await Project.find({user}).populate('user').lean()
  res.render('my-projects', {
    title: 'My projects',
    isProjects: true,
    myProjects: myProjects,
  })
})

router.get('/add', authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add project',
    isAdd: true,
    errorAddProject: req.flash('errorAddProject')
  })
})

// router.get('/profile', userMiddleware, async (req, res) => {
//   const user = req.userId
//   const myProfile = await User.findById(user).lean()
//   res.render('profile', {
//     title: 'Profile',
//     isProfile: true,
//     myProfile: myProfile
//   })
// })

router.get('/projects/:id', async (req, res) => {
  const id = req.params.id
  const project = await Project.findById(id).populate('user').lean()

  res.render('projects', {
    id: id,
    title: 'Detail',
    project: project,
  })
})

router.get('/projects/:projectId/attachments/', userMiddleware, async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.userId;
  const project = mongoose.Types.ObjectId(projectId)
  const attachment = await Attachment.find({project: project}).lean();
  const attachmentFilter = attachment.map((attach) => {
    attach.isAdmin = attach.user.toString() == userId;
    return attach;
  });
  res.render('attachments', {
    title: 'Attachments',
    attachment: attachmentFilter,
    projectId: projectId,
    userId: req.userId,
    attachmentId: req.attachmentId ? req.attachmentId.toString() : null
  })
})

router.get('/projects/:projectId/add-attachment/', userMiddleware, authMiddleware, (req, res) => {
  const projectId = req.params.projectId
  res.render('add-attachment', {
    title: 'Add Attachment',
    // isAddAttachment: true,
    projectId: projectId,
    errorAddAttachment: req.flash('errorAddAttachment')
  })
})

// router.get('/projects/:projectId/attachments/edit-attachment/:id', async (req, res) => {
//   const id = req.params.id
//   const projectId = req.params.projectId
//   const attachment = await Attachment.findById(id).lean()

//   res.render('edit-attachment', {
//     title: 'Edit attachment',
//     attachment: attachment,
//     errorEditAttachment: req.flash('errorEditAttachment'),
//     projectId: projectId
//   })
// })

router.get('/projects/:projectId/messages/', userMiddleware, async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.userId;
  const project = mongoose.Types.ObjectId(projectId)
  const messages = await Message.find({project: project}).lean();
  const messagesFilter = messages.map((message) => {
    message.isAdmin = message.user.toString() == userId;
    return message;
  });
  res.render('messages', {
    title: 'Messages',
    messages: messagesFilter,
    projectId: projectId,
    messageId: req.messageId ? req.messageId.toString() : null,
  })
})

router.get('/projects/:projectId/threads/', userMiddleware, async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.projectId
  const project = mongoose.Types.ObjectId(projectId)
  const threads = await Thread.find({project: project}).lean();
  const threadsFilter = threads.map((thread) => {
    thread.isAdmin = thread.user.toString() == userId;
    return thread;
  });
  res.render('threads', {
    title: 'Threads',
    userId: userId,
    threads: threads,
    projectId: projectId,
    threadId: req.threadId ? req.threadId.toString() : null,
  })
})

router.get('/projects/:projectId/add-message/', userMiddleware, authMiddleware, (req, res) => {
  const projectId = req.params.projectId
  res.render('add-message', {
    title: 'Add Message',
    // isAddMessage: true,
    projectId: projectId,
    errorAddMessage: req.flash('errorAddMessage')
  })
})

router.get('/projects/:projectId/add-thread/', userMiddleware, authMiddleware, (req, res) => {
  const projectId = req.params.projectId
  res.render('add-thread', {
    title: 'Add Thread',
    // isAddThread: true,
    projectId: projectId,
    errorAddThread: req.flash('errorAddThread')
  })
})

router.get('/projects/:projectId/messages/edit-message/:id', async (req, res) => {
  const id = req.params.id
  const projectId = req.params.projectId
  const message = await Message.findById(id).lean()

  res.render('edit-message', {
    title: 'Edit message',
    message: message,
    errorEditMessage: req.flash('errorEditMessage'),
    projectId: projectId
  })
})

router.get('/projects/:projectId/threads/edit-thread/:id', async (req, res) => {
  const id = req.params.id
  const projectId = req.params.projectId
  const thread = await Thread.findById(id).lean()

  res.render('edit-thread', {
    title: 'Edit thread',
    thread: thread,
    errorEditThread: req.flash('errorEditThread'),
    projectId: projectId
  })
})

router.get('/edit-project/:id', async (req, res) => {
  const id = req.params.id
  const project = await Project.findById(id).populate('user').lean()

  res.render('edit-project', {
    title: 'Edit project',
    project: project,
    errorEditProject: req.flash('errorEditProject'),
  })
})

// router.get('/edit-profile/:id', async (req, res) => {
//   const id = req.params.id
//   const profile = await User.findById(id).populate('user').lean()

//   res.render('edit-profile', {
//     title: 'Edit profile',
//     profile: profile,
//     errorEditProfile: req.flash('errorEditProfile')
//   })
// })

router.post('/projects/:projectId/add-attachment/', upload.single('file'), userMiddleware, async (req, res) => {
  const projectId = req.params.projectId
  const project = mongoose.Types.ObjectId(projectId)
  const file = req.file;
  const pathFile = "files/" + req.file?.filename
  if(!file) {
    req.flash('errorAddAttachment', 'All fields is required')
    res.redirect(`/projects/${project}/add-attachment/`)
    return
  }

  const data = await Attachment.create({user: req.userId, attachment: pathFile, project: project})
  res.redirect(`/projects/${project}/attachments/`);
})

router.post('/projects/:projectId/add-message/', userMiddleware, async (req, res) => {
  const projectId = req.params.projectId
  const userId = req.userId;
  const project = mongoose.Types.ObjectId(projectId)
  const {title, description} = req.body
  if(!title || !description) {
    req.flash('errorAddMessage', 'All fields is required')
    res.redirect(`/projects/${project}/add-message/`)
    return
  }
  const data = await Message.create({...req.body, message: req.messageId, project: project, user: userId});
  res.redirect(`/projects/${project}/messages/`)
})

router.post('/projects/:projectId/add-thread/', userMiddleware, async (req, res) => {
  const projectId = req.params.projectId
  const userId = req.userId;
  const project = mongoose.Types.ObjectId(projectId)
  const {title} = req.body
  if(!title) {
    req.flash('errorAddThread', 'All fields is required')
    res.redirect(`/projects/${project}/add-thread/`)
    return
  }

  const data = await Thread.create({...req.body, thread: req.threadId, project: project, user: userId});
  res.redirect(`/projects/${project}/threads/`)
})

router.post('/add-project', userMiddleware, async (req, res) => {
  const {title, description} = req.body
  if(!title || !description) {
    req.flash('errorAddProject', 'All fields is required')
    res.redirect('/add')
    return
  }

  await Project.create({...req.body, user: req.userId})
  res.redirect('/')
})

// router.post('/projects/:projectId/attachments/edit-attachment/:id', async (req, res) => {
//   const {attachment} = req.body
//   const id = req.params.id
//   const projectId = req.params.projectId
//   if(!attachment) {
//     req.flash('errorEditAttachment', 'All fields is required')
//     res.redirect(`/projects/${projectId}/attachments/edit-attachment/${id}`)
//     return
//   }

//   await Attachment.findByIdAndUpdate(id, req.body, {new: true})
//   res.redirect(`/projects/${projectId}/attachments`)
// })

router.post('/projects/:projectId/messages/edit-message/:id', async (req, res) => {
  const {title, description} = req.body
  const id = req.params.id
  const projectId = req.params.projectId
  if(!title || !description) {
    req.flash('errorEditMessage', 'All fields is required')
    res.redirect(`/projects/${projectId}/messages/edit-message/${id}`)
    return
  }

  await Message.findByIdAndUpdate(id, req.body, {new: true})
  res.redirect(`/projects/${projectId}/messages`)
})

router.post('/projects/:projectId/threads/edit-thread/:id', async (req, res) => {
  const {title} = req.body
  const id = req.params.id
  const projectId = req.params.projectId
  if(!title) {
    req.flash('errorEditThread', 'All fields is required')
    res.redirect(`/projects/${projectId}/threads/edit-thread/${id}`)
    return
  }

  await Thread.findByIdAndUpdate(id, req.body, {new: true})
  res.redirect(`/projects/${projectId}/threads`)
})

router.post('/edit-project/:id', async (req, res) => {
  const {title, description} = req.body
  const id = req.params.id
  if(!title || !description) {
    req.flash('errorEditProject', 'All fields is required')
    res.redirect(`/edit-project/${id}`)
    return
  }

  await Project.findByIdAndUpdate(id, req.body, {new: true})
  res.redirect('/')
})

// router.post('/edit-profile/:id', async (req, res) => {
//   const {email, password} = req.body
//   const id = req.params.id
//   if(!email || !password) {
//     req.flash('errorEditProfile', 'All fields is required')
//     res.redirect(`/edit-profile/${id}`)
//     return
//   }

//   await User.findByIdAndUpdate(id, req.body, {new: true})
//   res.redirect('/')
// })

router.post('/delete-project/:id', async (req, res) => {
  const id = req.params.id

  await Project.findByIdAndRemove(id)
  res.redirect('/')
})

// router.post('/delete-profile/:id', async (req, res) => {
//   const id = req.params.id

//   await User.findByIdAndRemove(id)
//   res.redirect('/')
// })

router.post('/projects/:projectId/messages/delete-message/:id', async (req, res) => {
  const id = req.params.id
  const projectId = req.params.projectId

  await Message.findByIdAndRemove(id)
  res.redirect(`/projects/${projectId}/messages/`)
})

router.post('/projects/:projectId/attachments/delete-attachment/:id', async (req, res) => {
  const id = req.params.id
  const projectId = req.params.projectId
  const attachments = await Attachment.findById(id).lean();
  const filePath = __dirname.replace("routes", "") + attachments.attachment;
  fs.unlinkSync(filePath);
  await Attachment.findByIdAndRemove(id)
  res.redirect(`/projects/${projectId}/attachments/`)
})

router.post('/projects/:projectId/threads/delete-thread/:id', async (req, res) => {
  const id = req.params.id
  const projectId = req.params.projectId

  await Thread.findByIdAndRemove(id)
  res.redirect(`/projects/${projectId}/threads`)
})

router.get('/download/:id', async (req, res) => {
  const attachmentId = req.params.id;
  const attachment = await Attachment.findById(attachmentId);
  const filePath = __dirname.replace("routes", "") + attachment.attachment;
  return res.download(filePath)
});

export default router
