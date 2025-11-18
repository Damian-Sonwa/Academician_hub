# MongoDB Integration

This app is now connected to MongoDB Atlas!

## Connection Details
- **Connection String**: `mongodb+srv://madudamian25_db_user:sopuluchukwu@cluster0.t1jvgmx.mongodb.net/`
- **Database Name**: `evolve_interactive_hub`

## Usage Example

```tsx
import { useMongoDBContext } from '@/integrations/mongodb/context';

function MyComponent() {
  const { db, isConnected, error } = useMongoDBContext();

  if (error) {
    return <div>Error connecting to MongoDB: {error.message}</div>;
  }

  if (!isConnected) {
    return <div>Connecting to MongoDB...</div>;
  }

  // Use the db object to interact with MongoDB
  const fetchData = async () => {
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    console.log(users);
  };

  return <div>Connected to MongoDB!</div>;
}
```

## Collections

You can create and use collections like:

```tsx
const usersCollection = db.collection('users');
const coursesCollection = db.collection('courses');
const progressCollection = db.collection('progress');
```

## CRUD Operations

### Create
```tsx
await db.collection('users').insertOne({ name: 'John', email: 'john@example.com' });
```

### Read
```tsx
const users = await db.collection('users').find({}).toArray();
```

### Update
```tsx
await db.collection('users').updateOne(
  { email: 'john@example.com' },
  { $set: { name: 'John Doe' } }
);
```

### Delete
```tsx
await db.collection('users').deleteOne({ email: 'john@example.com' });
```


